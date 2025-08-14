"use client";

import { cn } from "@/lib/utils";
import { FieldValues, FieldErrors, UseFormRegister } from "react-hook-form";

interface TextareaProps {
  id: string;
  label?: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  // register: (id: string, options?: any) => UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
  isFormLoadError?: boolean;
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  errors,
  label,
  register,
  disabled,
  required,
  id,
  isFormLoadError,
  className,
}) => {
  return (
    <div className={className}>
      <textarea
        rows={6}
        id={id}
        autoComplete="off"
        className={cn(
          "block w-full outline-none border-[1.5px] border-[##E7E7E7] focus:border-primaryBlue/45 py-2.5 text-primaryBlack sm:text-sm sm:leading-6 pl-2.5 bg-[#ffffff] rounded-[20px]",
          errors[id] && "ring-red-500",
          disabled && "opacity-50"
        )}
        placeholder={label}
        {...register(id, { required })}
        disabled={disabled}
      ></textarea>
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
  );
};

export default Textarea;
