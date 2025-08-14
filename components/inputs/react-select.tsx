"use client";

import { FieldErrors } from "react-hook-form";
import React, { useEffect, useState } from "react";
import ReactSelect, {
  ActionMeta,
  SingleValue as ReactSelectSingleValue,
  components,
  PlaceholderProps,
  ControlProps,
  MenuProps,
} from "react-select";
import { IoIosArrowDown } from "react-icons/io";
import { cn } from "@/lib/utils";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value?: SelectOption | null;
  onChange: (
    newValue: ReactSelectSingleValue<SelectOption> | null,
    actionMeta: ActionMeta<SelectOption>
  ) => void;
  errors?: FieldErrors;
  isRequired?: boolean;
  customPlaceholder?: string;
  id: string;
  options: { label: string; value: string }[];
  isRequiredIndicator?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  errors,
  customPlaceholder = "Select an option",
  id,
  options,
  isRequiredIndicator,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  // Define custom Placeholder component with the correct props type
  const Placeholder = (props: PlaceholderProps<SelectOption>) => (
    <components.Placeholder {...props}>
      {(value && value.label) || customPlaceholder}
    </components.Placeholder>
  );

  // Define custom Control component with the correct props type
  const Control = (props: ControlProps<SelectOption, false>) => (
    <components.Control {...props}>
      {props.children}
      <IoIosArrowDown className="text-primaryPurple mr-2 text-primaryRed" />
    </components.Control>
  );

  // Define custom Menu component with the correct props type
  const Menu = (props: MenuProps<SelectOption, false>) => (
    <components.Menu {...props}>{props.children}</components.Menu>
  );

  const DropdownIndicator = () => null;

  return (
    <div className="relative">
      {label && (
        <label
          className={cn(
            "block text-xs text-primaryBlack leading-6",
            errors && "text-red-500"
          )}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <ReactSelect
        components={{
          Placeholder,
          Control,
          DropdownIndicator,
          Menu,
        }}
        id={id}
        placeholder={customPlaceholder}
        isDisabled={false}
        //@ts-expect-error nothing
        value={value?.value}
        onChange={onChange}
        options={options}
        styles={{
          control: (base) => ({
            ...base,
            paddingTop: "9px",
            paddingBottom: "9px",
            boxShadow: "none",
            width: "100%",
            // border: "none",
            display: "flex",
            alignItems: "center",
            paddingRight: "0",
          }),
          indicatorSeparator: () => ({}),
          dropdownIndicator: (defaultStyles) => ({
            ...defaultStyles,
            color: "primaryBlue", // Change the arrow color (as an example, set to red)
          }),
          menu: (base) => ({
            ...base,
            zIndex: 9999,
          }),
          menuList: (base) => ({
            ...base,
            zIndex: 9999,
            width: "100%",
            height: "250px",
            border: "none",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "primaryBlue" : "white",
            color: state.isFocused ? "white" : "black",
            "&:active": {
              backgroundColor: "primaryBlue",
            },
          }),
        }}
      />
      {errors && errors[id] && (
        <p className="text-red-500 text-xs mt-1">
          {errors[id]?.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default Select;
