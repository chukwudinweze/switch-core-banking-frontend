import dynamic from "next/dynamic";

export const ModalContainer = dynamic(() => import("./modal-container"), {
  ssr: false,
});
export const SuccessModal = dynamic(() => import("./success-modal"), {
  ssr: false,
});

export const ConfirmLogoutModal = dynamic(
  () => import("./confirm-logout-modal"),
  {
    ssr: false,
  }
);
export const ConfirmTransfer = dynamic(() => import("./confirm-transfer"), {
  ssr: false,
});
export const TransferRequestModal = dynamic(
  () => import("./transfer-request-modal"),
  {
    ssr: false,
  }
);
