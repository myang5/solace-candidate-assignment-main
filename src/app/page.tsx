"use client";

import { useEffect, useState } from "react";
import { GetAdvocatesResponseType } from "./api/advocates/route";
import TextInput from "./components/TextInput";
import AdvocateListItem from "./components/AdvocateListItem";
import pluralize from "pluralize";
import clsx from "clsx";
import TextButton from "./components/TextButton";
import useRequest from "@ahooksjs/use-request";
import InfiniteScroll from "react-infinite-scroll-component";
import { SelectAdvocate } from "@/db/schema";
import "./app.css";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [advocates, setAdvocates] = useState<SelectAdvocate[]>();
  const {
    run: fetchAdvocates,
    data,
    loading: loadingAdvocates,
  } = useRequest<GetAdvocatesResponseType>(
    (searchTerm, next) =>
      `/api/advocates?${new URLSearchParams({
        searchTerm: searchTerm || "",
        pageSize: String(20),
        next: next || "",
      })}`,
    {
      loadingDelay: 1000,
      debounceInterval: 100,
      manual: true,
      onSuccess: (response, [_, next]) => {
        // If next is defined, we requested the next page of results
        // to append our current list of results.
        // If next is not defined, we're initiating a new search.
        // This approach prevents UI flickering from resetting
        // the list of results between searches.
        setAdvocates((advocates) =>
          next ? (advocates || []).concat(response.data) : response.data
        );
      },
    }
  );
  const { count: totalAdvocates, next } = data || {};

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
      <BodyContainerOuter className="flex-none bg-green1-800 shadow-md shadow-green1-500 p-[16px] md:p-[20px]">
        <div className={bodyContainerInnerCls}>
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
        </div>
      </BodyContainerOuter>
      <BodyContainerOuter
        id="scrollableDiv"
        className={clsx(
          "advocates-list",
          "flex-auto overflow-auto pt-[24px] pb-[16px] px-[16px] md:pb-[20px] md:px-[20px]"
        )}
      >
        {loadingAdvocates || !advocates ? (
          <p className={clsx(bodyContainerInnerCls, "text-subtitle-normal")}>
            Searching advocates...
          </p>
        ) : !totalAdvocates ? (
          <p className={clsx(bodyContainerInnerCls, "text-subtitle-normal")}>
            Try a different search to see more results.
          </p>
        ) : (
          <InfiniteScroll
            dataLength={advocates.length}
            hasMore={!!next}
            next={() => {
              fetchAdvocates(searchTerm, next);
            }}
            loader={null}
            scrollableTarget="scrollableDiv"
            className={clsx(bodyContainerInnerCls, "flex flex-col gap-y-[20px] pb-[20px]")}
          >
            {advocates.map((advocate) => {
              return <AdvocateListItem key={advocate.id} advocate={advocate} />;
            })}
          </InfiniteScroll>
        )}
      </BodyContainerOuter>
    </main>
  );
}

const BodyContainerOuter = ({
  className,
  id,
  children,
}: {
  className?: string;
  id?: string;
  children: React.ReactNode;
}) => {
  return (
    <div id={id} className={clsx("flex justify-center w-full", className)}>
      {children}
    </div>
  );
};

const bodyContainerInnerCls = "w-full md:max-w-[980px]";
