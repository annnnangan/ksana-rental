import { toast } from "react-toastify";

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export const uploadImage = async (
  file: File,
  imageType: string,
  studioId: number
) => {
  const signedURLParams = {
    originalFileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    checksum: await computeSHA256(file),
  };

  try {
    // Generate a signed URL for the image
    const signedURLFetchResponse = await fetch("/api/uploads/signed-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signedURLParams),
    });

    if (!signedURLFetchResponse.ok) {
      const errorResponse = await signedURLFetchResponse.json();
      throw new Error(
        errorResponse.error.message || "Failed to generate signed URL."
      );
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

      // Save the image path to the database
      await fetch(`/api/studio/${studioId}/basic-info/images`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageType,
          imageUrl: signedURL.split("?")[0],
        }),
      });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "系統出現錯誤，請重試。";
    return errorMessage;
  }
};
