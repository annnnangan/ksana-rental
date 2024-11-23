import classNames from "classnames";
import React from "react";

const priceType = [
  { label: "Non-Peak", bgColor: "bg-green-500", textColor: "text-green-500" },
  { label: "Peak", bgColor: "bg-orange-500", textColor: "text-orange-500" },
  {
    label: "Unavailable",
    bgColor: "bg-gray-400",
    textColor: "text-gray-400",
  },
];

const TimeslotType = () => {
  return (
    <div className="flex md:flex-row flex-col items-start">
      {priceType.map((type) => (
        <div key={type.label} className="flex justify-center items-center me-4">
          <div
            className={classNames(
              type.bgColor,
              "rounded-full",
              "w-3",
              "h-3",
              "me-2"
            )}
          ></div>
          <p className={classNames(type.textColor)}>{type.label}</p>
        </div>
      ))}
    </div>
  );
};

export default TimeslotType;
