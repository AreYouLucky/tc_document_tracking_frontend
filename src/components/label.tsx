import * as React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

function Label({ className = "", ...props }: LabelProps) {
  const baseClasses =
    "text-white inter-regular text-[15px] text-gray-600 leading-none font-medium select-none disabled:pointer-events-none disabled:opacity-50";

  return (
    <label
      data-slot="label"
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
}

export { Label };
