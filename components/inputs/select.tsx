"use client";

import { cn } from "@/lib/utils";
import { FieldValues, FieldErrors, UseFormRegister } from "react-hook-form";

interface SelectProps {
  id: string;
  label?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
  isFormLoadError?: boolean;
  inputRef?: HTMLSelectElement | null;
  outsideLabel?: boolean;
  addBorder?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const SelectInput: React.FC<SelectProps> = ({
  errors,
  label,
  register,
  disabled,
  required,
  id,
  isFormLoadError,
  outsideLabel,
  addBorder,
  options,
  placeholder,
}) => {
  return (
    <div className="relative">
      {outsideLabel && (
        <label className="text-[#3A3A3A] text-xs font-medium" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        autoComplete="off"
        id={id}
        className={cn(
          "block w-full outline-none bg-[#3E4B830A] py-[12px] text-[#A8A8A8] sm:text-sm sm:leading-6 pl-2.5 rounded-[10px]",
          errors[id] && "ring-red-500",
          disabled && "opacity-50",
          addBorder && "border-[0.5px] border-[#D9D9D9] bg-white"
        )}
        {...register(id, { required })}
        disabled={disabled}
        defaultValue="" // Ensures the placeholder is shown by default
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="hover:bg-primary-500 hover:text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
      <div>
        {errors[id] && (
          <p className="text-red-500 text-xs mt-1">
            {errors[id]?.message?.toString()}
          </p>
        )}
        {isFormLoadError && (
          <div className="text-red-500 text-xs mt-1">
            Error loading the select options
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectInput;
