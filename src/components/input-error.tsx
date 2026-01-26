import { type HTMLAttributes } from 'react';

interface InputErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  message?: string;
  className?: string;
}

export default function InputError({
  message,
  className = '',
  ...props
}: InputErrorProps) {
  if (!message) return null;

  return (
    <p
      {...props}
      className={`poppins-regular text-xs text-red-600 dark:text-red-400 ${className}`}
    >
      {message}
    </p>
  );
}
