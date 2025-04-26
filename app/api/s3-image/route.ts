import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";

import { ForbiddenError } from "@/lib/http-errors";
import {
  allowedImageMineTypes,
  formattedMineTypes,
  ImageType,
  maxImageSizes,
} from "@/lib/validations/file";

import { getS3ImageKeyFromS3URL } from "@/lib/utils/s3-upload/get-s3-image-key-from-s3-url";
import { s3Client } from "@/lib/utils/s3-upload/s3-client";

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

/* ---------------------------- Get S3 Image URL ---------------------------- */
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
    const uploadedImageUrl = uploadResponse.url.split("?")[0];

    return NextResponse.json({
      success: true,
      data: { imageUrl: uploadedImageUrl },
    });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

/* ---------------------------- Delete S3 Image URL ---------------------------- */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const s3ImageKey = getS3ImageKeyFromS3URL(body.image);
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME!, // Your S3 bucket name
      Key: s3ImageKey, // The path to the image you want to delete
    };
    const command = new DeleteObjectCommand(deleteParams);
    // Send the delete command
    const result = await s3Client.send(command);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
