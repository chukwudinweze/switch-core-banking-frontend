"use client";

import { cn } from "@/lib/utils";
import { FieldValues, FieldErrors, UseFormRegister } from "react-hook-form";

interface InputProps {
  id: string;
  label?: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  disabled?: boolean;
  isFormLoadError?: boolean;
  inputRef?: HTMLInputElement | null;
  outsideLabel?: boolean;
  addBorder?: boolean;
}

const TextInput: React.FC<InputProps> = ({
  errors,
  label,
  register,
  disabled,
  required,
  type,
  id,
  isFormLoadError,
  outsideLabel,
  addBorder,
}) => {
  return (
    <div className="relative">
      {outsideLabel && (
        <label className="text-[#3A3A3A] text-xs font-medium" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        autoComplete="off"
        className={cn(
          "block w-full outline-none bg-[#3E4B830A] py-[10px] text-[#A8A8A8] sm:text-sm sm:leading-6 pl-2.5 rounded-[10px]",
          errors[id] && "ring-red-500",
          disabled && "opacity-50",
          addBorder && "border-[0.5px] border-[#D9D9D9] bg-white"
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
            {`Error loading ${id}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextInput;
