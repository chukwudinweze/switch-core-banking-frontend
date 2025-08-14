"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { FieldValues, FieldErrors, UseFormRegister } from "react-hook-form";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

interface InputProps {
  id: string;
  label?: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
  isFormLoadError?: boolean;
  outsideLabel?: boolean;
}

const PasswordInput: React.FC<InputProps> = ({
  errors,
  label,
  register,
  disabled,
  required,
  type,
  id,
  isFormLoadError,
  outsideLabel,
}) => {
  const [inputType, setInputType] = useState<"password" | "text">("password");

  // Function to toggle the password visibility
  const togglePasswordDisplay = () => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  return (
    <div className="relative">
      <div className="relative">
        {outsideLabel && (
          <label className="text-[#3A3A3A] text-xs font-medium" htmlFor={id}>
            {label}
          </label>
        )}
        <input
          id={id}
          type={inputType}
          autoComplete="off"
          className={cn(
            "block w-full outline-none bg-[#3E4B830A] py-[10px] text-[#A8A8A8] sm:text-sm sm:leading-6 pl-2.5 rounded-xl",
            errors[id] && "ring-red-500",
            disabled && "opacity-50"
          )}
          placeholder={outsideLabel ? "" : label}
          {...register(id, { required })}
          disabled={disabled}
        />
        <div>
          {errors[id] && (
            <p className="text-red-500 text-xs mt-1">
              {errors[id]?.message?.toString()}
            </p>
          )}
          {isFormLoadError && (
            <div className="text-red-500 text-xs mt-1">
              Error loading First Name
            </div>
          )}
        </div>
      </div>

      <div
        className="absolute top-10 right-5 cursor-pointer text-[#8F8F8F] text-[16px]"
        onClick={togglePasswordDisplay}
        role="button"
        aria-label="Toggle password visibility"
      >
        {inputType === "password" ? (
          <AiOutlineEyeInvisible />
        ) : (
          <AiOutlineEye />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
