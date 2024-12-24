import React from "react";
import ContactForm from "./ContactForm";
import StepTitle from "../_component/StepTitle";

const ContactPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  //Get Studio ID from URL
  const studioId = Number((await params).id);
  return (
    <>
      <div>
        <StepTitle>場地聯絡資料</StepTitle>
        <p className="text-sm md:text-base mb-6">
          請填寫場地聯絡資料，讓用戶可以了解更多場地。
        </p>
      </div>

      <ContactForm studioId={studioId} />
    </>
  );
};

export default ContactPage;
