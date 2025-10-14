import { Input } from "@headlessui/react";
import clsx from "clsx";

interface Props {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({ value, onChange }: Props) {
  return (
    <Input
      value={value || ""}
      onChange={onChange}
      className={clsx(
        "border border-solid border-black rounded-[8px] outline-0",
        "py-[12px] px-[14px]",
        "transition-all duration-200",
        "hover:border-[#3f6b5e]",
        "focus:border-[#285e50] focus:shadow-[0_0_0_2px_rgba(3,24,15,0.42)]"
      )}
    />
  );
}
