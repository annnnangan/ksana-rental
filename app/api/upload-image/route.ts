import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import handleError from "@/lib/handlers/error";

import { ForbiddenError } from "@/lib/http-errors";
import { allowedImageMineTypes, formattedMineTypes, ImageType, maxImageSizes } from "@/lib/validations/file";
import { generateFileName } from "../s3/route";
import { s3Client } from "@/lib/utils/s3-upload/s3-client";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData(); // Parse FormData here

    const imageType = formData.get("imageType") as ImageType;
    const file = formData.get("file") as File;
    const folderName = formData.get("folderName") as string;

    if (!file || !folderName || !imageType) {
      throw new ForbiddenError("缺少必要的參數。");
    }

    const maxImageSize = maxImageSizes[imageType];

    if (!maxImageSize) {
      throw new ForbiddenError("無效的圖片類型。");
    }

    if (!allowedImageMineTypes.includes(file.type)) {
      throw new ForbiddenError(`不支持此檔案格式。請上傳${formattedMineTypes.join(", ")}圖片檔案`);
    }

    if (file.size > maxImageSize) {
      throw new ForbiddenError(`檔案容量超出${maxImageSize / (1024 * 1024)}MB。`);
    }

    const fileName = `${generateFileName()}.${file.name.split(".").at(-1)}`;

    // Step 1: Get a signed URL
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `${folderName}/${fileName}`,
      ContentType: file.type,
      ContentLength: file.size,
    });

    const signedURL = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 60,
    });

    // Step 2: Upload the image to AWS S3
    const uploadResponse = await fetch(signedURL, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new ForbiddenError(`圖片上傳失敗，請重試。`);
    }

    // Step 3: Return the S3 file URL
    const uploadedImageUrl = signedURL.split("?")[0];

    return NextResponse.json({
      success: true,
      data: { imageUrl: uploadedImageUrl },
    });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
