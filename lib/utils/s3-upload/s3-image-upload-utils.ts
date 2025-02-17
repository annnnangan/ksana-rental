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

export const uploadImage = async (file: File, imageType: string, studioId: number, apiPath: string, httpMethod: string, folderName: string, payoutId: number | string | undefined = undefined) => {
  const signedURLParams = {
    imageType,
    originalFileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    folderName,
    checksum: await computeSHA256(file),
    studioId,
  };

  try {
    // Generate a signed URL for the image
    const signedURLFetchResponse = await fetch("/api/s3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signedURLParams),
    });

    if (!signedURLFetchResponse.ok) {
      const errorResponse = await signedURLFetchResponse.json();
      throw new Error(errorResponse.error.message || "Failed to generate signed URL.");
    }

    const signedURLData = await signedURLFetchResponse.json();

    if (signedURLData.success) {
      const signedURL = signedURLData.data;

      // Upload the image to AWS S3
      const imageUploadResponse = await fetch(signedURL, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!imageUploadResponse.ok) {
        throw new Error("系統出現錯誤，請重試。");
      }

      // const apiPath = imageType !== "gallery" ? "basic-info/images" : "gallery";

      // Save the image path to the database
      await fetch(`${apiPath}`, {
        method: `${httpMethod}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageType,
          imageUrl: signedURL.split("?")[0],
          studioId,
          payoutId,
        }),
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "系統出現錯誤，請重試。";
    return errorMessage;
  }
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
          const response = await fetch("/api/upload-image", {
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

    return { success: true, data: s3ImagesUrl };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};
