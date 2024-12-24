import React from "react";
import ContactForm from "./ContactForm";
import StepTitle from "../_component/StepTitle";

const ContactPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  //Get Studio ID from URL
  const studioId = Number((await params).id);
  return (
    <>
      <div>
        <StepTitle>上傳場地照片</StepTitle>
        <p className="text-sm md:text-base mb-6">
          請上傳最少3張，最多15張場地照片。
        </p>
      </div>

      <ContactForm studioId={studioId} />
    </>
  );
};

export default ContactPage;
