import handleError from "@/lib/handlers/error";
import { s3Client } from "@/services/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const allowedFileTypes = ["image/jpeg", "image/png"];

const maxFileSize = 1048576 * 2; // 2 MB

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

type GetSignedURLParams = {
  originalFileName: string;
  fileType: string;
  fileSize: number;
  checksum: string;
};

//get signed url
export async function POST(request: NextRequest) {
  try {
    const {
      originalFileName,
      fileType,
      fileSize,
      checksum,
    }: GetSignedURLParams = await request.json();

    const userId = 1;
    const studioId = 1;

    if (!allowedFileTypes.includes(fileType)) {
      throw new Error("不支持此檔案格式。請上傳jpeg或png圖片檔案。");
    }

    if (fileSize > maxFileSize) {
      throw new Error("檔案容量超出2MB。");
    }

    const fileName =
      generateFileName() + "." + originalFileName.split(".").at(-1);

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      ContentType: fileType,
      ContentLength: fileSize,
      ChecksumSHA256: checksum,
      // Let's also add some metadata which is stored in s3.
      Metadata: {
        userId: userId.toString(),
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
