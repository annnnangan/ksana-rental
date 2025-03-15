import { Loader2 } from "lucide-react";
import React from "react";

const LoadingSpinner = ({ height = "h-dvh" }: { height?: string }) => {
  return (
    <div className={`flex items-center justify-center ${height}`}>
      <Loader2 className="animate-spin text-primary" size={50} />
    </div>
  );
};

export default LoadingSpinner;
