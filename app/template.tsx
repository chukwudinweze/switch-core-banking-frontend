"use client";

import { Toaster } from "@/components/ui/toaster";
const RootTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

export default RootTemplate;
