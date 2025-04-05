import React from "react";

interface Props {
  children: React.ReactNode;
  textColor?: string;
}

const SectionTitle = ({ children, textColor }: Props) => {
  return <h1 className={`text-xl md:text-2xl my-4 font-bold ${textColor}`}>{children}</h1>;
};

export default SectionTitle;
