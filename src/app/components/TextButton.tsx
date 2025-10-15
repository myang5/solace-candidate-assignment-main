import { Button } from "@headlessui/react";
import clsx from "clsx";

interface Props {
  type?: TextButtonType;
  children: string;
  className?: string;
  onClick?: () => void;
}

enum TextButtonType {
  light = "light",
}

export default function TextButton({ type, children, className, onClick }: Props) {
  return (
    <Button
      className={clsx(
        "text-body-bold",
        "transition-all duration-200",
        type === TextButtonType.light
          ? [
              "text-white",
              "hover:text-green1-300",
              "focus:text-green1-300",
              "focus-visible:text-green1-300",
              "active:text-green1-500",
            ]
          : [
              "text-green1-800",
              "hover:text-green1-700",
              "focus:text-green1-700",
              "focus-visible:text-green1-700",
              "active:text-green1-600",
            ],
        className
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

TextButton.type = TextButtonType;
