import { TransferRequest } from "@/lib/types/bankingTypes";
import { create } from "zustand";

interface LabelState {
  payload: TransferRequest | {};
  setPayload: (value: TransferRequest) => void;
}

const useTransferRequest = create<LabelState>((set) => ({
  payload: {},
  setPayload: (value) => set({ payload: value }),
}));

export default useTransferRequest;
