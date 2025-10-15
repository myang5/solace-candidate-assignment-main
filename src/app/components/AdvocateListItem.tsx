import { SelectAdvocate } from "@/db/schema";
import Image from "next/image";
import React from "react";
import pluralize from "pluralize";

export default function AdvocateListItem({ advocate }: { advocate: SelectAdvocate }) {
  return (
    <div className="py-[20px] flex flex-col md:flex-row md:gap-x-[20px]">
      <div className="w-full md:w-[280px] flex flex-col">
        <p className="text-subtitle-lg-normal text-green1-700 mb-[8px]">
          {advocate.firstName} {advocate.lastName}, {advocate.degree}
        </p>
        <MetadataItem iconSrc="/phone-icon.svg">
          {formatPhoneNumber(advocate.phoneNumber)}
        </MetadataItem>
        <MetadataItem iconSrc="/location-icon.svg">{advocate.city}</MetadataItem>
        <MetadataItem iconSrc="/star-icon.svg">
          {pluralize("year", 1, true)} of experience
        </MetadataItem>
      </div>
      <div className="w-full">
        <p>Specialties:</p>
        <div>
          {advocate.specialties.map((s) => (
            <p key={s}>{s}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

const formatPhoneNumber = (value?: string) => {
  if (!value) {
    return value;
  }

  const groupDigitsIntoPhoneNumberGroups = (str: string) =>
    str.match(/^(\d{3})(\d{3})?(\d{4})/) || [];

  const groups = groupDigitsIntoPhoneNumberGroups(value);
  return `(${groups[1]}) ${groups[2]}-${groups[3]}`;
};

const MetadataItem = ({ iconSrc, children }: { iconSrc?: string; children: React.ReactNode }) => {
  return (
    <div className="text-caption-normal text-gray-500 filter-gray-500 mb-[4px] flex items-center">
      {iconSrc && <Image src={iconSrc} alt="" width={12} height={12} className="inline mr-[4px]" />}
      {children}
    </div>
  );
};
