"use client";

import { memo, useMemo } from "react";
import { Label, Dropdown, DropdownItem } from "flowbite-react";


interface DropdownFieldProps {
  id: string;
  name: string;
  label: string;
  options: string[];
  selected: string;
  handleSelect: (value: string) => void;
  required?: boolean;
}

const dropdownTheme = {
  floating: {
    target:
      "w-full bg-gray-50 border border-gray-300 text-gray-900 font-normal rounded-lg text-sm px-4 py-2.5 text-left shadow-sm cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-slate-400",
  },
} as const;

const DropdownFieldInner = ({
  id,
  label,
  options,
  selected,
  handleSelect,
  required = true,
}: DropdownFieldProps) => {
  const items = useMemo(
    () =>
      options.map((option, index) => (
        <DropdownItem
          key={index}
          onClick={() => handleSelect(option)}
          className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {option}
        </DropdownItem>
      )),
    [options, handleSelect]
  );

  return (
    <div className="mb-5">
      <Label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="relative w-full" id={id}>
        <Dropdown label={selected || "Select an option"} dismissOnClick className="w-full" theme={dropdownTheme}>
          {items}
        </Dropdown>
      </div>
    </div>
  );
}

const areEqual = (prev: Readonly<DropdownFieldProps>, next: Readonly<DropdownFieldProps>) => {
  return (
    prev.selected === next.selected &&
    prev.label === next.label &&
    prev.required === next.required &&
    prev.options === next.options &&
    prev.handleSelect === next.handleSelect &&
    prev.id === next.id &&
    prev.name === next.name
  );
};

export const DropdownField = memo(DropdownFieldInner, areEqual);