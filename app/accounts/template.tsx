"use client";

import {
  ModalContainer,
  SuccessModal,
  ConfirmLogoutModal,
  ConfirmTransfer,
  TransferRequestModal,
} from "@/components/popups/modal/dynamic-modals";
import { Toaster } from "@/components/ui/toaster";
import useModalStore from "@/hooks/store/useModalStore";
import { useInactivityTimeout } from "@/hooks/useInactivityTimeout";
import { getSession } from "@/lib/actions/get-session";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

const MainTemplate = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { activeModal } = useModalStore();
  const router = useRouter();

  useInactivityTimeout();

  useEffect(() => {
    const checkSession = async () => {
      const session = getSession();
      if (!session) {
        router.replace("/");
      }
    };
    checkSession();
  }, [router]);

  return (
    <>
      <Toaster />

      <ModalContainer
        isModalOpen={activeModal === "successModal"}
        isCloseButton={true}
      >
        <SuccessModal />
      </ModalContainer>

      <ModalContainer
        isModalOpen={activeModal === "confirmLogoutModal"}
        isCloseButton={true}
      >
        <ConfirmLogoutModal />
      </ModalContainer>
      <ModalContainer
        isModalOpen={activeModal === "transferRequest"}
        isCloseButton={true}
      >
        <TransferRequestModal />
      </ModalContainer>
      <ModalContainer
        isModalOpen={activeModal === "confirmTransfer"}
        isCloseButton={true}
      >
        <ConfirmTransfer />
      </ModalContainer>

      {children}
    </>
  );
};

export default MainTemplate;
