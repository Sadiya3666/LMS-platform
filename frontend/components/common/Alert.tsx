import React from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

type AlertType = "error" | "success" | "info" | "warning";

interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert = ({ type = "info", title, children, className = "" }: AlertProps) => {
  const styles = {
    error: "bg-red-50 text-red-800 border-red-200",
    success: "bg-green-50 text-green-800 border-green-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  };

  const icons = {
    error: <XCircle className="h-5 w-5 text-red-400" />,
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    info: <Info className="h-5 w-5 text-blue-400" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-400" />,
  };

  return (
    <div className={`rounded-md border p-4 ${styles[type]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="ml-3">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className={`text-sm ${title ? "mt-2" : ""}`}>{children}</div>
        </div>
      </div>
    </div>
  );
};
