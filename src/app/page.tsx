"use client";

import { useEffect, useState } from "react";
import { GetAdvocatesResponseType } from "./api/advocates/route";
import TextInput from "./components/TextInput";
import AdvocateListItem from "./components/AdvocateListItem";
import pluralize from "pluralize";
import clsx from "clsx";
import TextButton from "./components/TextButton";
import useRequest from "@ahooksjs/use-request";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const {
    run: fetchAdvocates,
    data,
    loading: loadingAdvocates,
  } = useRequest<GetAdvocatesResponseType>(
    (searchTerm, next) =>
      `/api/advocates?${new URLSearchParams({
        searchTerm: searchTerm || "",
        pageSize: String(5),
        next: next || "",
      })}`,
    { loadingDelay: 1000, debounceInterval: 100, manual: true }
  );
  const { data: advocates, count: totalAdvocates, next } = data || {};

  useEffect(() => {
    fetchAdvocates();
  }, []);

  const searchAdvocates = (searchTerm?: string) => {
    setSearchTerm(searchTerm || "");
    fetchAdvocates(searchTerm);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    searchAdvocates(searchTerm);
  };

  const onReset = () => {
    searchAdvocates("");
  };

  return (
    <main className="bg-white w-screen h-screen flex flex-col">
      <BodyContainer className="bg-green1-800 shadow-md shadow-green1-500 p-[16px] md:p-[20px]">
        <h1 className="hidden md:block text-title-normal text-white mb-[16px]">
          Find a Solace Advocate
        </h1>
        <TextInput
          type={TextInput.type.light}
          value={searchTerm}
          label={"Search for:"}
          wrapperStyles="w-full md:max-w-[400px]"
          onChange={onChange}
        />
        <TextButton type={TextButton.type.light} className="mt-[8px]" onClick={onReset}>
          Reset Search
        </TextButton>
        <p className="mt-[16px] text-white text-subtitle-normal md:text-subtitle-lg-normal">
          {pluralize("advocate", totalAdvocates || 0, true)}
        </p>
      </BodyContainer>
      <BodyContainer className="h-full overflow-scroll pt-[24px] pb-[16px] px-[16px] md:pb-[20px] md:px-[20px]">
        {loadingAdvocates || !advocates ? (
          <p className="text-subtitle-normal">Searching advocates...</p>
        ) : !totalAdvocates ? (
          <p className="text-subtitle-normal">Try a different search to see more results.</p>
        ) : (
          <div className="flex flex-col gap-y-[20px] pb-[20px]">
            {advocates.map((advocate) => {
              return <AdvocateListItem key={advocate.id} advocate={advocate} />;
            })}
          </div>
        )}
      </BodyContainer>
    </main>
  );
}

const BodyContainer = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={clsx("flex justify-center w-full", className)}>
      <div className="w-full md:max-w-[980px]">{children}</div>
    </div>
  );
};
