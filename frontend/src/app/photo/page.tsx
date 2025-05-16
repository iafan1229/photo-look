"use client";

import PhotoList from "@/components/list/PhotoList";
import TopList from "@/components/list/TopList";
import { useEffect, useState } from "react";

export default function Photo() {
  const [filterValue, setFilterValue] = useState<string>();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setFilterValue("total");
  }, []);
  return (
    <>
      <TopList
        filterValue={filterValue}
        searchValue={searchValue}
        setFilterValue={setFilterValue}
        setSearchValue={setSearchValue}
      />
      <PhotoList filterValue={filterValue} searchValue={searchValue} />
    </>
  );
}
