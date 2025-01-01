import { studioService } from "@/services/StudioService";
import StepTitle from "../_component/StepTitle";
import ConfirmationForm from "./ConfirmationForm";

const ContactPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  //Get Studio ID from URL
  const studioId = Number((await params).id);
  const userId = 1;
  const onboardingStepsResult = await studioService.getOnboardingSteps(
    studioId,
    userId
  );

  const isFilledAllSteps =
    onboardingStepsResult.success &&
    areAllStepsCompleted(onboardingStepsResult.data, requiredSteps);

  return (
    <>
      <div>
        <StepTitle>確認申請</StepTitle>
        <p className="text-sm md:text-base mb-6">
          請閱讀和同意條款與細則，並送出你的申請，Ksana會於3-7個工作天內審查你的申請。
        </p>
      </div>

      <ConfirmationForm
        studioId={studioId}
        isFilledAllSteps={isFilledAllSteps}
      />
    </>
  );
};

const requiredSteps = [
  "basic-info",
  "business-hour-and-price",
  "equipment",
  "gallery",
  "door-password",
  "contact",
  "payout-info",
];

function areAllStepsCompleted(
  completedSteps: { step: string }[],
  requiredSteps: string[]
) {
  const completedStepSet = new Set(completedSteps.map((step) => step.step));
  return requiredSteps.every((step) => completedStepSet.has(step));
}

export default ContactPage;
