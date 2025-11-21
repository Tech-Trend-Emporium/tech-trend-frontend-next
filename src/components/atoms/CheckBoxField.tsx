"use client";

import { Checkbox, Label } from "flowbite-react";


export interface CheckboxFieldProps {
  id: string;
  label: string;
  name: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CheckboxField = ({ id, label, checked, onChange}: CheckboxFieldProps) => {
  return(
  <div className="flex items-center gap-3 mb-6 group">
    <Checkbox 
      id={id}
      checked={checked} 
      onChange={onChange}
      
      className="w-4 h-4 text-slate-600 bg-gray-100 border-gray-300 rounded focus:ring-slate-500 dark:focus:ring-slate-400 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer transition-all duration-200"
    />
    <Label 
      htmlFor={id}
      className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer select-none group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-200"
    >
      {label}
    </Label>
  </div>
)};