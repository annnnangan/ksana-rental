"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";

interface tabList {
  name: string;
  query: string;
}

interface Props {
  activeTab: string;
  tabListMap: tabList[];
  useQueryString?: boolean;
  setActiveTab?: (tab: string) => void;
}

const ResponsiveTab = ({ activeTab, tabListMap, useQueryString = true, setActiveTab }: Props) => {
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    if (useQueryString) {
      router.push(`?tab=${tab}`, { scroll: false });
    } else {
      if (setActiveTab) {
        setActiveTab(tab);
      }
    }
  };

  return (
    <div>
      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className={`flex`}>
            {tabListMap.map((tab) => (
              <TabsTrigger key={tab.query} value={tab.query}>
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile Dropdown */}
      <div className="md:hidden mb: border-b-2 pb-4">
        <Select value={activeTab} onValueChange={handleTabChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {tabListMap.map((tab) => (
              <SelectItem key={tab.query} value={tab.query}>
                {tab.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ResponsiveTab;
