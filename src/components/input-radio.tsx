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
      className={`cursor-pointer block rounded-lg p-4 transition-shadow border-3 ${
        isSelected ? "bg-orange-400 border-white text-white scale-105 transition-all duration-300" : "border-yellow-500 bg-white text-gray-950"
      } ${className}`}
    >
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
