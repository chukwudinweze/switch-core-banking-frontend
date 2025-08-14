"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthHeader from "../../components/auth-header";
import { AppLogo } from "@/components/logos";
import TextInput from "@/components/inputs/text-input";
import ModalContainer from "@/components/popups/modal/modal-container";

import useModalStore from "@/hooks/store/useModalStore";
import SuccessModal from "@/components/popups/modal/success-modal";

const formSchema = Yup.object().shape({
  email: Yup.string().required("email is required"),
});

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const openModal = useModalStore((state) => state.openModal);
  const activeModal = useModalStore((state) => state.activeModal);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
    },
    // @ts-ignore
    resolver: yupResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {};

  return (
    <>
      <ModalContainer
        isModalOpen={activeModal === "successModal"}
        isCloseButton={true}
      >
        <SuccessModal />
      </ModalContainer>
      <div className="w-full min-h-screen px-4 sm:px-8 md:px-16 lg:px-20 pt-10">
        <AppLogo height={65} width={64} />
        <AuthHeader />
        <div className="mb-3 mt-6 border-2 border-[#3E4B830A] rounded-xl pt-[61px] px-6 sm:px-8 md:px-12">
          <p className="text-[#575757] text-[13px] text-xs mb-2 font-medium">
            Please enter your Email below to reset your password
          </p>
          <form
            className="mb-16 mt-4 flex flex-col gap-4 sm:gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              type="text"
              id="email"
              required
              errors={errors}
              register={register}
              label="Email"
              outsideLabel
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primaryBlue text-white w-full hover:bg-primaryBlue/90 rounded-[12px] mt-3"
            >
              {isLoading ? (
                <Loader className="animate-spin mr-2 inline-block" size={16} />
              ) : (
                "Reset password"
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
