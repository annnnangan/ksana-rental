import React from "react";
import Section from "../Section";

interface Props {
  description: string;
}

const DescriptionSection = ({ description }: Props) => {
  return (
    <Section title={"關於場地"}>
      {description.split("\n").map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </Section>
  );
};

export default DescriptionSection;
