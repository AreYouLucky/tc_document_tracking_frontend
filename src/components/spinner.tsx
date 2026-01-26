import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Spinner({
  className = "",
  ...props
}: React.HTMLAttributes<SVGElement>) {
  return (
    <AiOutlineLoading3Quarters
      role="status"
      aria-label="Loading"
      className={`size-4 animate-spin ${className}`}
      {...props}
    />
  );
}

export { Spinner };
