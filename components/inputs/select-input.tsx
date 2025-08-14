import { FC } from "react";
import { cn } from "@/lib/utils";

interface SelectInputProps {
  label: string;
  options: { value: string | number; label: string }[];
  errors?: any;
  addBorder?: boolean;
  value?: string | number;
  customPlaceholder?: string;
  onChange?: (value: string) => void;
  id?: string;
  isDisabled?: boolean;
}

const SelectInput: FC<SelectInputProps> = ({
  label,
  options,
  errors,
  addBorder,
  value,
  customPlaceholder,
  onChange,
  id,
  isDisabled,
}) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="text-[#3A3A3A] text-xs font-medium">
        {label}
      </label>
      <select
        disabled={isDisabled}
        id={id}
        className={cn(
          "block w-full outline-none bg-[#3E4B830A] py-[13px] text-[#A8A8A8] sm:text-sm sm:leading-6 pl-2.5 rounded-[10px]",
          addBorder && "border-[0.5px] border-[#D9D9D9] bg-white"
        )}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="">{customPlaceholder || "Select an option"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
    </div>
  );
};

export default SelectInput;
