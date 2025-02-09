import handleError from "@/lib/handlers/error";
import { getS3ImageKeyFromS3URL } from "@/lib/utils/s3-upload/get-s3-image-key-from-s3-url";
import {
  allowedImageMineTypes,
  formattedMineTypes,
  maxCoverAndLogoImageSize,
  maxGalleryImageSize,
} from "@/lib/validations/file";

import { s3Client } from "@/lib/utils/s3-upload/s3-client";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

type GetSignedURLParams = {
  imageType: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  checksum: string;
  studioId: number;
  payoutId: string;
  folderName: string;
};

//Create AWS signed url
export async function POST(request: NextRequest) {
  try {
    const {
      imageType,
      originalFileName,
      fileType,
      fileSize,
      checksum,
      studioId,
      folderName,
    }: GetSignedURLParams = await request.json();

    const maxImageSize =
      imageType !== "gallery" ? maxCoverAndLogoImageSize : maxGalleryImageSize;

    if (!allowedImageMineTypes.includes(fileType)) {
      throw new Error(
        `不支持此檔案格式。請上傳${formattedMineTypes.join(", ")}圖片檔案`
      );
    }

    if (fileSize > maxImageSize) {
      throw new Error(`檔案容量超出${maxImageSize / (1024 * 1024)}MB。`);
    }

    const fileName =
      generateFileName() + "." + originalFileName.split(".").at(-1);

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `${folderName}/${fileName}`,
      ContentType: fileType,
      ContentLength: fileSize,
      ChecksumSHA256: checksum,
      Metadata: {
        studioId: studioId.toString(),
      },
    });

    const url = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 60,
    });

    return NextResponse.json({ success: true, data: url }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

//Delete image in AWS
export async function DELETE(request: NextRequest) {
  const body = await request.json();

  const s3ImageKey = getS3ImageKeyFromS3URL(body);
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME!, // Your S3 bucket name
    Key: s3ImageKey, // The path to the image you want to delete
  };

  try {
    const command = new DeleteObjectCommand(deleteParams);

    // Send the delete command
    await s3Client.send(command);
    return NextResponse.json({ success: true, data: "" }, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new Error("Failed to delete the file from S3");
  }
}
