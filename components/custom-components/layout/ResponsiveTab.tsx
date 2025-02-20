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
}

const ResponsiveTab = ({ activeTab, tabListMap }: Props) => {
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    router.push(`?tab=${tab}`, { scroll: false });
  };

  return (
    <div>
      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
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
