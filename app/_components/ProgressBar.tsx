import React from "react";

interface Props {
  steps: string[]; // Labels for each step
  currentStep: number; // The active step (1-based index)
}

const ProgressBar = ({ steps, currentStep }: Props) => {
  return (
    <div className="w-full space-y-4 ps-4">
      <div className="relative w-full flex items-center">
        {steps.map((_, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div
                className={`h-2 flex-1 ${
                  currentStep > index ? "bg-primary" : "bg-gray-300"
                }`}
              />
            )}

            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold absolute transform -translate-x-1/2 ${
                currentStep > index
                  ? "bg-primary border-2 border-primary"
                  : currentStep === index + 1
                  ? "bg-blue-700 border-2 border-primary"
                  : "bg-gray-300 border-2 border-gray-300"
              }`}
              style={{
                left: `${(index / (steps.length - 1)) * 100}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {index + 1}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Step Labels */}
      <div className="w-full flex justify-between text-sm">
        {steps.map((step, index) => (
          <span
            key={index}
            className={`${
              currentStep >= index + 1 ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
