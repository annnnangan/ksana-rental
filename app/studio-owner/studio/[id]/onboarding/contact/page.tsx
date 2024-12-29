import { studioService } from "@/services/StudioService";
import StepTitle from "../_component/StepTitle";
import ContactForm from "./ContactForm";
import { SocialPlatform } from "@/services/model";

const ContactPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  //Get Studio ID from URL
  const studioId = Number((await params).id);

  const userId = 1;

  const phoneResult = await studioService.getPhone(studioId, userId);
  const phoneDefaultValue =
    phoneResult.success && phoneResult.data !== null ? phoneResult.data : "";
  const socialResult = await studioService.getSocial(studioId, userId);

  const socialDefaultValue =
    socialResult.success && socialResult.data.length > 0
      ? formatSocialData(
          socialResult.data as { type: SocialPlatform; contact: string }[]
        )
      : {};
  return (
    <>
      <div>
        <StepTitle>場地聯絡資料</StepTitle>
        <p className="text-sm md:text-base mb-6">
          請填寫場地聯絡資料，讓用戶可以了解更多場地。
        </p>
      </div>

      <ContactForm
        studioId={studioId}
        phoneDefaultValue={phoneDefaultValue}
        socialDefaultValue={socialDefaultValue}
      />
    </>
  );
};

export default ContactPage;

function formatSocialData(
  data: { type: SocialPlatform; contact: string }[]
): Record<SocialPlatform, string | undefined> {
  const defaultSocialLinks: Record<SocialPlatform, string | undefined> = {
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
  };

  return data.reduce((acc, item) => {
    acc[item.type] = item.contact;
    return acc;
  }, defaultSocialLinks);
}
