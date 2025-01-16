import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import ImagePreview from "./ImagePreview";

const ProofUploadAndPreview = () => {
  const [images, setImages] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      //convert FileList to array
      const files = Array.from(e.target.files);
      const newImageURLs = files.map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImageURLs]);
      //reset input after upload
      e.target.value = "";
    }
  };

  const handleImageRemove = (imageToDelete: string) => {
    const updatedImages = images.filter((image) => !(image === imageToDelete));
    URL.revokeObjectURL(imageToDelete);
    setImages(updatedImages);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(images);
  };

  return (
    <>
      <form className="border rounded-lg p-5 mb-5" onSubmit={handleSubmit}>
        <p className="font-bold mb-2">Upload payout proof</p>
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          multiple
          className="text-sm"
          onChange={handleFileSelect}
        />

        <div className="mt-5 mb-20">
          <p className="font-bold">Payout Proof Preview</p>
          <ImagePreview images={images} onImageRemove={handleImageRemove} />
        </div>

        <Button>Submit</Button>
      </form>
    </>
  );
};

export default ProofUploadAndPreview;
