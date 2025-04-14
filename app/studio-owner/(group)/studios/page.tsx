import { auth } from "@/lib/next-auth-config/auth";
import { studioOwnerService } from "@/services/studio/StudioOwnerService";

import LinkButton from "@/components/animata/button/link-button";
import AvatarWithFallback from "@/components/custom-components/common/AvatarWithFallback";
import AddNewStudio from "@/components/custom-components/studio-owner/AddNewStudio";
import StudioStatusBadge from "@/components/custom-components/StudioStatusBadge";
import ToastMessageWithRedirect from "@/components/custom-components/common/ToastMessageWithRedirect";
import {
  findAreaByDistrictValue,
  getDistrictLabelByDistrictValue,
} from "@/lib/utils/areas-districts-converter";
import { Avatar } from "@radix-ui/react-avatar";
import { ImageIcon, MapPin } from "lucide-react";
import Image from "next/image";
import DeleteDraftStudio from "@/components/custom-components/studio-owner/DeleteDraftStudio";

const StudiosPage = async () => {
  const session = await auth();

  if (!session?.user) {
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={"請先登入後才可處理。"}
        redirectPath={"/auth/login"}
      />
    );
  }

  const studios = (await studioOwnerService.getStudiosByUserId(session?.user.id)).data;

  return (
    <>
      {studios?.length == 0 ? (
        <AddNewStudio hasCreatedStudio={false} isDashboard={false} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {studios?.map((studio) => (
            <div className="px-3 pb-10" key={studio.id}>
              <div className="rounded-md overflow-hidden shadow">
                <div className="relative">
                  {/* Cover Image */}
                  <div className="relative aspect-[3/1] bg-neutral-200  mb-1">
                    {studio.cover_photo ? (
                      <Image
                        alt="studio cover image"
                        src={studio.cover_photo}
                        fill={true}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon />
                      </div>
                    )}
                  </div>

                  {studio.status === "draft" && (
                    <div className="absolute top-1 right-0">
                      <DeleteDraftStudio studioName={studio.name} studioId={studio.id} />
                    </div>
                  )}
                </div>
                {/* Logo */}
                <div className="flex gap-x-2">
                  <div>
                    <div className="-mt-6 ml-3 mb-1 flex items-end gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarWithFallback avatarUrl={studio.logo} type={"studio"} />
                      </Avatar>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold">{studio.name}</h3>
                </div>

                <div className="p-5">
                  <div className="flex gap-x-1">
                    <p className="text-sm">場地狀態:</p>
                    <StudioStatusBadge status={studio.status} />
                  </div>
                </div>
                <div className="flex justify-between px-5 pb-2">
                  <div>
                    {studio.district && (
                      <div className="flex justify-center items-center">
                        <MapPin size={14} />
                        <p className="text-sm">
                          {getDistrictLabelByDistrictValue(studio.district)},{" "}
                          {findAreaByDistrictValue(studio.district)?.label}
                        </p>
                      </div>
                    )}
                  </div>

                  {studio.status === "active" && (
                    <LinkButton href={`/studio-owner/studio/${studio.id}/manage/dashboard`}>
                      管理場地
                    </LinkButton>
                  )}
                  {studio.status === "draft" && (
                    <LinkButton href={`/studio-owner/studio/${studio.id}/onboarding/basic-info`}>
                      繼續登記
                    </LinkButton>
                  )}
                </div>
              </div>
            </div>
          ))}
          <AddNewStudio hasCreatedStudio={true} isDashboard={false} />
        </div>
      )}
    </>
  );
};

export default StudiosPage;
