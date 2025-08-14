"use client";

import SelectInput from "@/components/inputs/select-input";
import TextInput from "@/components/inputs/text-input";
import { Button } from "@/components/ui/button";
import { useFetchUserAcounts } from "@/hooks/fetchers/useFetchUserAcounts";
import useTransferRequest from "@/hooks/store/useTransferRequest";
import Configs from "@/lib/configs";
import { TransferRequest } from "@/lib/types/bankingTypes";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import * as Yup from "yup";

const formSchema = Yup.object().shape({
  phoneNumber: Yup.string().required("phoneNumber is required"),
  password: Yup.string().required("Password is required"),
});

const Transfer = () => {
  const setPayload = useTransferRequest((state) => state.setPayload);
  const {
    data: accounts,
    isLoading: isLoadingAccts,
    error,
  } = useFetchUserAcounts(`${Configs.baseUrl}/api/accounts`);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransferRequest>({
    defaultValues: {
      amount: 0,
      beneficiaryAccountNumber: "",
      description: "",
      sourceAccountId: "",
    },
    // @ts-ignore
    resolver: yupResolver(formSchema),
  });

  const onSubmit: SubmitHandler<TransferRequest> = async (values) => {
    setPayload({
      amount: values.amount,
      beneficiaryAccountNumber: values.beneficiaryAccountNumber,
      description: values.description,
      sourceAccountId: values.sourceAccountId,
    });
  };
  return (
    <form
      className="mb-16 mt-4 flex flex-col gap-4 sm:gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="sourceAccountId"
        render={({ field }) => (
          <SelectInput
            label="Select Account"
            id="sourceAccountId"
            value={field.value}
            onChange={field.onChange}
            options={accounts.map((a) => ({
              label: a.accountNumber,
              value: a.id,
            }))}
            customPlaceholder="Select"
            errors={errors.sourceAccountId}
            addBorder
          />
        )}
      />
      <TextInput
        type="number"
        id="amount"
        required
        errors={errors}
        register={register}
        label="Amount"
        outsideLabel
      />
      <div className="mt-3">
        <Button
          type="submit"
          className="bg-primaryBlue text-white w-full hover:bg-primaryBlue/90"
        >
          Transfer
        </Button>
      </div>
    </form>
  );
};

export default Transfer;
