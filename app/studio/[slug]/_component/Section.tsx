import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

const Section = ({ title, children }: Props) => {
  return (
    <div className="mt-5 bg-gray-50 p-8 rounded-lg">
      <h3 className="text-xl text-primary font-bold pl-3 py-1 border-l-8">
        {title}
      </h3>
      <div className="mt-2 pl-5">{children}</div>
    </div>
  );
};

export default Section;
