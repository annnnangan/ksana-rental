import React from "react";

interface Props {
  children: React.ReactNode;
}

const SectionTitle = ({ children }: Props) => {
  return <h1 className="text-xl md:text-2xl my-4 font-bold">{children}</h1>;
};

export default SectionTitle;
