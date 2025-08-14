"use client";

import SelectInput from "@/components/inputs/select-input";
import TextInput from "@/components/inputs/text-input";
import { Button } from "@/components/ui/button";
import { useFetchUserAcounts } from "@/hooks/fetchers/useFetchUserAcounts";
import useTransferRequest from "@/hooks/store/useTransferRequest";
import Configs from "@/lib/configs";
import { apiAccountLookup } from "@/lib/services/bankingServices";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AccountLookupResponse,
  TransferRequest,
} from "@/lib/types/bankingTypes";
import { useEffect, useState, useCallback } from "react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Loader2 } from "lucide-react";
import useModalStore from "@/hooks/store/useModalStore";

// Updated Yup schema to match TransferRequest type
const formSchema = Yup.object().shape({
  sourceAccountId: Yup.string().required("Please select an account"),
  amount: Yup.number()
    .min(1, "Amount must be greater than 0")
    .required("Amount is required"),
  beneficiaryAccountNumber: Yup.string()
    .length(10, "Account number must be 10 digits")
    .required("Account number is required"),
  description: Yup.string().optional(),
});

const TransferRequestModal = () => {
  const setPayload = useTransferRequest((state) => state.setPayload);
  const [accountLookupRes, setAccountLookupRes] =
    useState<AccountLookupResponse>();

  const openModal = useModalStore((state) => state.openModal);

  const [isLookingUp, setIsLookingUp] = useState(false);
  const {
    data: accounts,
    isLoading: isLoadingAccts,
    error,
  } = useFetchUserAcounts(`${Configs.baseUrl}/api/accounts`);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<TransferRequest>({
    defaultValues: {
      amount: undefined,
      beneficiaryAccountNumber: "",
      description: "",
      sourceAccountId: "",
    },
    //@ts-ignore
    resolver: yupResolver(formSchema),
  });

  const enteredAcct = watch("beneficiaryAccountNumber");
  useEffect(() => {
    const fetchAccount = async () => {
      if (enteredAcct.length === 10) {
        setIsLookingUp(true);

        try {
          const res = await apiAccountLookup(enteredAcct);

          if (res.succeeded) {
            setAccountLookupRes(res.data);
            clearErrors("beneficiaryAccountNumber");
          } else {
            console.log("pppp====", res);
            setAccountLookupRes(undefined);
            setError("beneficiaryAccountNumber", {
              type: "manual",
              message: res.message || res.error?.[0] || "Account not valid",
            });
          }
        } catch (error: any) {
          setAccountLookupRes(undefined);

          const backendMsg = error?.response?.data?.message || error?.message;

          setError("beneficiaryAccountNumber", {
            type: "manual",
            message:
              backendMsg || "Failed to lookup account. Please try again.",
          });
        } finally {
          setIsLookingUp(false);
        }
      } else {
        setAccountLookupRes(undefined);
        clearErrors("beneficiaryAccountNumber");
      }
    };

    fetchAccount();
  }, [enteredAcct, setError, clearErrors]);

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    setPayload({
      amount: values.amount,
      beneficiaryAccountNumber: values.beneficiaryAccountNumber,
      description: values.description,
      sourceAccountId: values.sourceAccountId,
    });
    openModal("confirmTransfer");
  };

  return (
    <form
      className="mb-16 mt-4 flex flex-col gap-4 sm:gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      {isLoadingAccts && <div>Loading accounts...</div>}
      {error && (
        <div className="text-red-600">
          Error loading accounts: {error.message}
        </div>
      )}
      {!isLoadingAccts && !error && (
        <Controller
          control={control}
          name="sourceAccountId"
          render={({ field }) => (
            <SelectInput
              label="Select Account"
              id="sourceAccountId"
              value={field.value}
              onChange={field.onChange}
              options={
                accounts?.map((a) => ({
                  label: a.accountNumber,
                  value: a.id,
                })) || []
              }
              customPlaceholder="Select"
              errors={errors.sourceAccountId}
              addBorder
            />
          )}
        />
      )}
      <TextInput
        type="number"
        id="amount"
        required
        errors={errors}
        register={register}
        label="Amount"
        outsideLabel
      />
      <TextInput
        type="text"
        id="beneficiaryAccountNumber"
        required
        errors={errors}
        register={register}
        label="Beneficiary Account Number"
        outsideLabel
      />
      {isLookingUp && (
        <Loader2
          className="animate-spin inline-block text-primaryBlue"
          size={14}
        />
      )}
      {accountLookupRes && (
        <div className="text-primaryBlue text-sm -mt-4">
          {accountLookupRes.name}
        </div>
      )}
      <TextInput
        type="text"
        id="description"
        errors={errors}
        register={register}
        label="Description (Optional)"
        outsideLabel
      />
      <div className="mt-3">
        <Button
          type="submit"
          className="bg-[#18425D] text-white w-full hover:bg-[#2A5674]"
          disabled={
            isLoadingAccts ||
            !!error ||
            isLookingUp ||
            !!errors.beneficiaryAccountNumber
          }
        >
          Transfer
        </Button>
      </div>
    </form>
  );
};

export default TransferRequestModal;
