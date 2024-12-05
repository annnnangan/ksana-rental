"use client";
import ToastMessage from "@/app/_components/ToastMessageWithRedirect";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, ImageUp as ImageUpIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

const StudioCreatePage = () => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  //Display uploaded image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      const signedURLParams = {
        originalFileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        checksum: await computeSHA256(file),
      };

      try {
        //Generate a signed url to authorize to upload the image
        const signedURLFetchResponse = await fetch("/api/uploads/signed-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signedURLParams),
        });

        if (!signedURLFetchResponse.ok) {
          const errorResponse = await signedURLFetchResponse.json();
          console.log(errorResponse);
          throw new Error(
            errorResponse.error.message || "系統出現錯誤，請重試。"
          );
        }

        const signedURLData = await signedURLFetchResponse.json();

        if (signedURLData.success) {
          const signedURL = signedURLData.data;
          //Fetch the signed url to upload the image to AWS S3 bucket
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

          //save the image path to database
          await fetch("/api/studio/" + 1 + "/images", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageType: "cover_photo",
              imageUrl: signedURL.split("?")[0],
            }),
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "系統出現錯誤，請重試。";
        toast(errorMessage, {
          position: "top-right",
          type: "error",
          autoClose: 1000,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative w-auto h-60 aspect-[3/1] bg-neutral-200">
        {previewUrl && file ? (
          <img
            src={previewUrl}
            alt="Selected file"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute right-1/2 top-1/2">
            <ImageIcon />
          </div>
        )}

        <div className="absolute bottom-3 right-3">
          <Button
            className="rounded-full text-sm border-primary hover:bg-primary hover:text-white"
            variant="outline"
            onClick={handleClick}
          >
            <ImageUpIcon /> 上載封面圖片
          </Button>

          <input
            className="bg-transparent flex-1 border-none outline-none hidden"
            name="media"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            ref={hiddenFileInput}
          />
        </div>
      </div>

      <Button type="submit"> Save</Button>
    </form>
  );
};

export default StudioCreatePage;
