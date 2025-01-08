import TopGallery from "./_component/gallery/TopGallery";

const StudioPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  console.log(slug);
  return (
    <>
      <TopGallery />
    </>
  );
};

export default StudioPage;
