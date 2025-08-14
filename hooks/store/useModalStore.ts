import { create } from "zustand";

type ModalName =
  | "successModal"
  | "resetPasswordOTPModal"
  | "invoiceModal"
  | "confirmLogoutModal"
  | "addRestrictionModal"
  | "confirmTransfer"
  | "transferRequest";

interface ModalState {
  activeModal: ModalName | null;
  entityId: ModalName | null;
  openModal: (modal: ModalName, id?: ModalName | null) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  entityId: null,
  openModal: (modal, id) => set({ activeModal: modal, entityId: id }),
  closeModal: () => set({ activeModal: null, entityId: null }),
}));

export default useModalStore;
