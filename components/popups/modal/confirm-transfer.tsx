import NairaSymbol from "@/components/naira-symbol";
import { Button } from "@/components/ui/button";
import { useFetchTableData } from "@/hooks/fetchers/useFetchTableData";

import useModalStore from "@/hooks/store/useModalStore";
import useTransferRequest from "@/hooks/store/useTransferRequest";
import Configs from "@/lib/configs";
import { apiInitiateTransfer } from "@/lib/services/bankingServices";
import { TransferRequest } from "@/lib/types/bankingTypes";

import { Loader } from "lucide-react";
import { useState } from "react";

const ConfirmTransfer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const closeModal = useModalStore((state) => state.closeModal);
  const openModal = useModalStore((state) => state.openModal);
  const requestPayload = useTransferRequest(
    (state) => state.payload as TransferRequest
  );

  const { mutate } = useFetchTableData(
    `${Configs.baseUrl}/api/accounts?SortOrder=asc&PageSize=12&PageNumber=1`
  );

  const handleSubmitComment = async () => {
    setIsLoading(true);
    try {
      const response = await apiInitiateTransfer(
        requestPayload as TransferRequest
      );
      if (response?.status === "Completed") {
        closeModal();
        openModal("successModal");
        await mutate(undefined, { revalidate: true });
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6">
      <h6 className="text-primaryBlack font-medium text-center">
        Confirm Transfer
      </h6>
      <p className="text-primaryBlack text-center mt-4 mb-10">
        Are you sure you want to transfer{" "}
        <span className="text-primaryBlue font-semibold">
          <NairaSymbol />
          {requestPayload.amount.toLocaleString()}
        </span>{" "}
        to{" "}
        <span className="text-primaryBlue font-semibold">
          {Configs.beneficiaryName}
        </span>
      </p>
      <div className="flex item  s-center justify-center gap-4">
        <Button
          onClick={() => closeModal()}
          variant="ghost"
          className="bg-primaryGreen/10 text-primaryGreen px-12 rounded-xl"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmitComment} className="px-9 rounded-xl">
          {isLoading ? (
            <Loader className="animate-spin mr-2 inline-block" size={16} />
          ) : (
            "Confirm Transfer"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmTransfer;
