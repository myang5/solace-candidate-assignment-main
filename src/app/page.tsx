"use client";

import { useEffect, useState } from "react";
import { GetAdvocatesResponseType } from "./api/advocates/route";
import TextInput from "./components/TextInput";
import AdvocateListItem from "./components/AdvocateListItem";
import pluralize from "pluralize";
import clsx from "clsx";
import TextButton from "./components/TextButton";

export default function Home() {
  const [advocates, setAdvocates] = useState<GetAdvocatesResponseType>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<GetAdvocatesResponseType>([]);
  const [searchTerm, setSearchTerm] = useState<string>();

  useEffect(() => {
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    setFilteredAdvocates(filterAdvocates(advocates, searchTerm));
  };

  const onClick = () => {
    setFilteredAdvocates(advocates);
    setSearchTerm("");
  };

  return (
    <main className="bg-white w-screen h-screen flex flex-col">
      <BodyContainer className="border-b border-solid border-gray-300 shadow-md p-[16px] md:p-[20px]">
        <h1 className="hidden md:block text-title-normal text-green1-800 mb-[16px]">
          Find a Solace Advocate
        </h1>
        <TextInput
          value={searchTerm}
          label={"Search for:"}
          wrapperStyles="w-full md:max-w-[400px]"
          onChange={onChange}
        />
        <TextButton className="mt-[8px]" onClick={onClick}>
          Reset Search
        </TextButton>
        <p className="mt-[16px] text-subtitle-normal md:text-subtitle-lg-normal">
          {pluralize("advocate", filteredAdvocates.length, true)}
        </p>
      </BodyContainer>
      <BodyContainer className="h-full overflow-scroll pt-[24px] pb-[16px] px-[16px] md:pb-[20px] md:px-[20px]">
        {!filteredAdvocates.length && <p>Try a different search to see results.</p>}
        <div className="flex flex-col gap-y-[20px] pb-[20px]">
          {filteredAdvocates.map((advocate) => {
            return <AdvocateListItem key={advocate.id} advocate={advocate} />;
          })}
        </div>
      </BodyContainer>
    </main>
  );
}

const filterAdvocates = (advocates: GetAdvocatesResponseType, searchTerm: string) => {
  const searchTermLower = searchTerm.toLowerCase();
  return advocates.filter((advocate) => {
    return (
      advocate.firstName.toLowerCase().includes(searchTermLower) ||
      advocate.lastName.toLowerCase().includes(searchTermLower) ||
      advocate.city.toLowerCase().includes(searchTermLower) ||
      advocate.degree.toLowerCase().includes(searchTermLower) ||
      advocate.specialties.some((specialty) => specialty.toLowerCase().includes(searchTermLower)) ||
      String(advocate.yearsOfExperience).includes(searchTermLower)
    );
  });
};

const BodyContainer = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={clsx("flex justify-center", className)}>
      <div className="w-full md:max-w-[980px]">{children}</div>
    </div>
  );
};
