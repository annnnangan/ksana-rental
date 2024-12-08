import React from "react";

interface Props {
  children: string;
}

const FieldRemarks = ({ children }: Props) => {
  return <p className="text-xs text-gray-500">{children}</p>;
};

export default FieldRemarks;
