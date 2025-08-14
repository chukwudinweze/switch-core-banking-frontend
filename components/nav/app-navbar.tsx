"use client";

import React, { useEffect, useState } from "react";
import { DashSecondaryLogo } from "../logos";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdOutlineLogin, MdOutlineLogout } from "react-icons/md";
import useLoginStore from "@/hooks/store/useLoginStore";
import useModalStore from "@/hooks/store/useModalStore";
import { getSession } from "@/lib/actions/get-session";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { MdOutlineMenu } from "react-icons/md";

const AppNavbar = () => {
  const [isUserSession, setIsUserSession] = useState<boolean | null>(null);
  const userLoginData = useLoginStore((state) => state.userLoginData);
  const openModal = useModalStore((state) => state.openModal);
  const router = useRouter();

  useEffect(() => {
    // Check session status only on the client
    const session = getSession();
    setIsUserSession(!!session);
  }, []);

  if (isUserSession === null) {
    return (
      <nav className="fixed top-0 -[100000] flex items-center w-full bg-white border-b border-[#E7E7E7] py-4 px-10 justify-between">
        <DashSecondaryLogo width={140} height={140} />
        <div className="w-full flex items-center justify-end">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex flex-col gap-1">
              <div className="w-20 h-4 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <div>
      <nav className="fixed top-0 z-[100000] flex items-center w-full bg-white border-b border-[#E7E7E7] py-4 pl-5 pr-10 md:pr-10 md:pl-10 justify-between">
        {/* <div className="mt-2 mr-4 flex md:hidden">
          <Sheet>
            <SheetTrigger>
              <MdOutlineMenu className="text-2xl" />
            </SheetTrigger>
            <SheetContent side="left"><AppSidebar /> </SheetContent>
          </Sheet>
        </div> */}
        <div className="min-w-[20%]">
          <DashSecondaryLogo width={140} height={140} />
        </div>
        {isUserSession ? (
          <div className="w-full flex items-center justify-between">
            <div></div>
            <div className="flex items-center gap-1">
              <Avatar className="hidden md:flex">
                <AvatarImage src="" />
                <AvatarFallback>
                  {userLoginData?.firstName.charAt(0)}{" "}
                  {userLoginData?.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-xs font-semibold">
                <p className="mb-1 text-[#575757]">
                  {userLoginData?.firstName} {userLoginData?.lastName}
                </p>
                <div
                  onClick={() => openModal("confirmLogoutModal")}
                  className="text-primaryBlue flex items-center gap-1 cursor-pointer"
                >
                  <p>Sign Out</p>
                  <MdOutlineLogout />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => router.push("/auth/login")}
            className="text-primaryBlue flex items-center gap-1 cursor-pointer"
          >
            <p>Login</p>
            <MdOutlineLogin />
          </div>
        )}
      </nav>
    </div>
  );
};

export default AppNavbar;
