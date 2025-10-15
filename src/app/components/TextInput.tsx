import { Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";

interface Props {
  value?: string;
  label?: string;
  wrapperStyles?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({ value, label, wrapperStyles, onChange }: Props) {
  return (
    <Field className={clsx("flex flex-col", wrapperStyles)}>
      {label && <Label className={clsx("text-subtitle-bold text-black mb-[12px]")}>{label}</Label>}
      <Input
        type="text"
        value={value || ""}
        onChange={onChange}
        className={clsx(
          "border border-solid border-black rounded-[8px]",
          "w-full py-[12px] px-[14px]",
          "text-body-normal  text-black",
          "transition-all duration-200",
          "hover:border-green1-700",
          "focus:border-green1-800 focus:shadow-[0_0_0_2px_rgba(3,24,15,0.42)] focus:outline-none",
          "focus-visible:border-green1-800 focus-visible:shadow-[0_0_0_2px_rgba(3,24,15,0.42)] focus-visible:outline-none"
        )}
      />
    </Field>
  );
}
