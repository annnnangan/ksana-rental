import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import { ImageType } from "@/lib/validations/file";

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
};

export const addUploadTimestampToFile = (file: File, index: number) => {
  // Encode the index into the lastModified timestamp
  const lastModifiedWithIndex = Date.now() + index;

  const newFile = new File([file], file.name, {
    type: file.type,
    lastModified: lastModifiedWithIndex,
  });
  return newFile;
};

/* Upload Image to S3 and return the image url */
export const generateAWSImageUrls = async (images: File[], folderName: string, imageType: ImageType) => {
  try {
    if (!images) {
      throw new NotFoundError("圖片");
    }

    let s3ImagesUrl = [];

    if (images) {
      s3ImagesUrl = await Promise.all(
        images.map(async (image) => {
          // Prepare FormData for the image upload
          const formData = new FormData();
          formData.append("file", image); // Append the file
          formData.append("folderName", folderName);
          formData.append("imageType", imageType);
          // Send request to the API route to upload the image
          const response = await fetch("/api/s3-image", {
            method: "POST",
            body: formData,
          });

          // Handle the response
          if (!response.ok) {
            return await response.json();
          }

          const data = await response.json();
          return data.data.imageUrl; // Return the image URL from the response
        })
      );
    }

    return { success: true, data: s3ImagesUrl as string[] };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};
