"use client";

import EmailForm from "@/components/form/EmailForm";
import PhotoList from "@/components/list/PhotoList";
import TopList from "@/components/list/TopList";

export default function Photo() {
  return (
    <>
      <TopList />
      <PhotoList />
      {/* <EmailForm /> */}
    </>
  );
}
