import * as React from "react";

interface InputRadioProps<T> {
  name: string;
  value: T; 
  selectedValue: T; 
  onChange: (value: T) => void; 
  children: React.ReactNode; 
  className?: string;
}

export function InputRadio<T>({
  name,
  value,
  selectedValue,
  onChange,
  children,
  className = "",
}: InputRadioProps<T>) {
  const isSelected = value === selectedValue;

  return (
    <label
      className={`group relative block cursor-pointer overflow-hidden rounded-[1.75rem] border-2 transition-all duration-300 ${
        isSelected
          ? "border-white bg-linear-to-br from-orange-500 to-amber-500 text-white shadow-[0_20px_45px_rgba(234,88,12,0.35)] scale-[1.02]"
          : "border-orange-200 bg-white text-gray-950 shadow-[0_16px_30px_rgba(148,163,184,0.15)] hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_20px_40px_rgba(234,88,12,0.18)]"
      } ${className}`}
    >
      <span
        className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 ${
          isSelected ? "bg-white/80" : "bg-linear-to-r from-orange-300 to-yellow-300"
        }`}
      />
      <input
        type="radio"
        name={name}
        value={String(value)}
        checked={isSelected}
        onChange={() => onChange(value)}
        className="hidden"
      />
      {children}
    </label>
  );
}
