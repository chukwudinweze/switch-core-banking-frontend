"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthHeader from "../../components/auth-header";
import { useEffect, useState } from "react";
import { AppLogo } from "@/components/logos";
import TextInput from "@/components/inputs/text-input";
import PasswordInput from "@/components/inputs/password-input";
import useLoginStore from "@/hooks/store/useLoginStore";
import Configs from "@/lib/configs";
import { getSession } from "@/lib/actions/get-session";
import { apiAuthenticate } from "@/lib/services/bankingServices";

const formSchema = Yup.object().shape({
  phoneNumber: Yup.string().required("phoneNumber is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const session = getSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setUserLoginData = useLoginStore((state) => state.setUserLoginData);

  useEffect(() => {
    if (session) {
      router.replace("/accounts");
    }
  }, [router, session]);

  const handleForgotPassword = () => {
    router.push("/auth/reset-password");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
    // @ts-ignore
    resolver: yupResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    setIsLoading(true);

    try {
      const response = await apiAuthenticate({
        phoneNumber: values.phoneNumber,
        password: values.password,
      });

      if (response?.jwToken) {
        sessionStorage.setItem(Configs.authToken, response.jwToken);
        setUserLoginData(response);
        router.push("/");
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 md:px-16 lg:px-20 pt-10">
      <AppLogo height={100} width={100} />
      <AuthHeader />
      <div className="mb-3 mt-6 border-2 border-[#3E4B830A] rounded-xl pt-[61px] px-6 sm:px-8 md:px-12">
        <p className="text-[#575757] text-[13px] text-xs mb-2 font-medium">
          Please enter your details below to login
        </p>

        <form
          className="mb-16 mt-4 flex flex-col gap-4 sm:gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInput
            type="text"
            id="phoneNumber"
            required
            errors={errors}
            register={register}
            label="Phone Number"
            outsideLabel
          />
          <PasswordInput
            type="password"
            id="password"
            required
            errors={errors}
            register={register}
            label="Enter Password"
            outsideLabel
          />
          <div className="mt-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primaryBlue text-white w-full hover:bg-primaryBlue/90"
            >
              {isLoading ? (
                <Loader className="animate-spin mr-2 inline-block" size={16} />
              ) : (
                "Continue"
              )}
            </Button>
            <div className="w-full flex items-center justify-between mt-2">
              <button
                onClick={handleForgotPassword}
                type="button"
                className="text-primaryBlue font-semibold hover:text-primaryBlue/90 text-xs"
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
