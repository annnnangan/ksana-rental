import SlideArrowButton from "@/components/animata/button/slide-arrow-button";
import { onBoardingStepsMap } from "@/lib/constants/studio-details";
import { sessionUser } from "@/lib/next-auth-config/session-user";
import { studioOwnerService } from "@/services/studio/StudioOwnerService";
import { Check } from "lucide-react";
import Link from "next/link";

const page = async () => {
  const user = await sessionUser();
  const latestDraftStudioList = await studioOwnerService.getLatestDraftStudioOnboardingStepStatus(
    user?.id as string
  );
  if (latestDraftStudioList.data === "") {
    return;
  }

  //@ts-expect-error no error
  const steps = latestDraftStudioList.data?.onboardingStepStatus;
  //@ts-expect-error no error
  const draftStudioId = latestDraftStudioList.data?.latestDraftStudioId;
  //@ts-expect-error no error
  const draftStudioName = latestDraftStudioList.data?.latestDraftStudioName;

  return (
    <div className="space-y-3 mb-5 border border-gray-300 rounded-lg shadow p-4">
      <h2 className="text-lg md:text-2xl font-bold">你有正在建立的場地</h2>

      <h3 className="text-md font-semibold">{draftStudioName}</h3>
      <div className="grid grid-cols-8 gap-1">
        {onBoardingStepsMap?.map((step, index) => (
          <div key={index}>
            {/* Step and Label Container */}
            <div className="flex flex-col items-center">
              {/* Step Circle */}
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold ${
                  steps?.find((item: { step: string }) => item.step === step.value)?.is_complete
                    ? "bg-primary"
                    : "bg-gray-300"
                }`}
              >
                {steps?.find((item: { step: string }) => item.step === step.value)?.is_complete ? (
                  <Check />
                ) : (
                  index + 1
                )}
              </div>

              {/* Step Label */}
              <span
                className={`text-xs md:text-sm mt-2 text-center ${
                  steps?.find((item: { step: string }) => item.step === step.value)?.is_complete
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        ))}
      </div>
      <Link href={`/studio-owner/studio/${draftStudioId}/onboarding/basic-info`}>
        <SlideArrowButton primaryColor="hsl(var(--primary))" className="mt-5">
          繼續申請
        </SlideArrowButton>
      </Link>
    </div>
  );
};

export default page;
