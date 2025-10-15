import { Button } from "@headlessui/react";
import clsx from "clsx";

interface Props {
  children: string;
  className?: string;
  onClick?: () => void;
}

export default function TextButton({ children, className, onClick }: Props) {
  return (
    <Button
      className={clsx(
        "text-body-bold text-green1-800",
        "hover:text-green1-700",
        "focus:text-green1-700",
        "focus-visible:text-green1-700",
        "active:text-green1-600",
        "transition-all duration-200",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
