import React from "react";
import ContactForm from "./ContactForm";
import StepTitle from "../_component/StepTitle";
import { studioService } from "@/services/StudioService";
import { removeCountryCode } from "@/lib/utils/remove-country-code";

const ContactPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  //Get Studio ID from URL
  const studioId = Number((await params).id);

  const userId = 1;

  const phoneResult = await studioService.getPhone(studioId, userId);
  const phoneDefaultValue =
    phoneResult.success && phoneResult.data !== null
      ? removeCountryCode(phoneResult.data)
      : "";
  const socialResult = await studioService.getSocial(studioId, userId);

  const socialDefaultValue =
    socialResult.success && socialResult.data.length > 0
      ? formatSocialData(
          socialResult.data as { type: string; contact: string }[]
        )
      : {};

  console.log(socialResult);
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

function formatSocialData(data: { type: string; contact: string }[]) {
  const result = data.reduce((acc: { [key: string]: string }, item) => {
    acc[item.type] = item.contact;
    return acc;
  }, {});

  return result;
}

// [
//   { type: "website", contact: "https://www.soul-yogi.com" },
//   { type: "instagram", contact: "https://www.instagram.com/soul-yogi" },
// ];

//{website: xxxxxxxxx,
// instagram: XXXXX
//}
