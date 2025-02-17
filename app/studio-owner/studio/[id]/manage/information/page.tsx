import ResponsiveTab from "@/components/custom-components/layout/ResponsiveTab";
import SectionTitle from "@/components/custom-components/studio-details/SectionTitle";
import StudioDetailsContent from "@/components/custom-components/studio-details/StudioDetailsContent";

interface SearchQuery {
  tab: string;
}

interface Params {
  id: string;
}

interface Props {
  searchParams: SearchQuery;
  params: Params;
}

const tabListMap = [
  { name: "基本資料", query: "basic-info" },
  { name: "圖片", query: "gallery" },
  { name: "聯絡", query: "contact" },
  { name: "設備", query: "equipment" },
  { name: "大門密碼", query: "door-password" },
];

const StudioInformationPage = async (props: Props) => {
  const searchParams = await props.searchParams;
  const { id: studioId } = await props.params;
  const activeTab = searchParams["tab"] || "basic-info";

  return (
    <div>
      <SectionTitle>更改場地資料</SectionTitle>
      <ResponsiveTab activeTab={activeTab} tabListMap={tabListMap} />
      <StudioDetailsContent activeTab={activeTab} studioId={studioId} />
    </div>
  );
};

export default StudioInformationPage;
