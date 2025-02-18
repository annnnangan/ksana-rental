import React, { PropsWithChildren } from "react";

interface Props {
  title: string;
  description?: string;
}

const StepIntro = ({ title, description }: Props) => {
  return (
    <div className="mb-5">
      <h1 className="text-2xl text-primary font-bold">{title}</h1>
      {description && <p className="text-sm md:text-base mt-1">{description}</p>}
    </div>
  );
};

export default StepIntro;
