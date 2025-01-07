import DesktopTopGallery from "./_component/gallery/DesktopTopGallery";
import GallerySlideshowModal from "./_component/gallery/GallerySlideshowModal";

const StudioPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  console.log(slug);
  return (
    <>
      <DesktopTopGallery />
      <GallerySlideshowModal />
    </>
  );
};

export default StudioPage;
