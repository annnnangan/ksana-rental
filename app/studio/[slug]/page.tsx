import DesktopTopGallery from "./_component/gallery/DesktopTopGallery";

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
    </>
  );
};

export default StudioPage;
