import LinkButton from "@/components/animata/button/link-button";
import { CalendarCheck2, UserRoundSearch } from "lucide-react";

const JoinUsBannerSection = () => {
  return (
    <div className="my-10 bg-join-us bg-cover bg-left-top h-[300px] rounded-lg flex items-center justify-end p-5">
      <div className="w-1/2 bg-white bg-opacity-80 p-5 rounded-lg">
        {/* Takes half of the container */}
        <h2 className="text-2xl font-bold">Join Us</h2>
        <p className="text-sm">成為我們的場地提供者</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="rounded-full bg-white w-8 h-8 flex justify-center items-center">
            <CalendarCheck2 size={20} color="#01a2c7" />
          </div>
          <p className="text-sm">輕鬆管理所有場地預約</p>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="rounded-full bg-white w-8 h-8 flex justify-center items-center">
            <UserRoundSearch size={20} color="#01a2c7" />
          </div>
          <p className="text-sm">尋找更多顧客</p>
        </div>

        <LinkButton href="/auth/register?redirect=/studio-owner/dashboard">
          加入我們
        </LinkButton>
      </div>
    </div>
  );
};

export default JoinUsBannerSection;
