import { Label, TextInput } from "flowbite-react";


export interface InputFieldProps {
  id: string;
  label: string;
  name: string;
  type?: string;
  value?: string | number;
  step?: string;
  min?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}

export const InputField = ({
  id,
  label,
  name,
  type = "text",
  value,
  step,
  min,
  onChange,
  required = true,
  placeholder,
}: InputFieldProps) => (
  <div>
    <Label 
      htmlFor={id}
      className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide"
    >
      {label}
    </Label>
    <TextInput
      id={id}
      name={name}
      type={type}
      step={step}
      min={min}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder || label}
      className="transition-all duration-200 ease-in-out"
      color="gray"
      style={{
        backgroundColor: 'transparent'
      }}
      theme={{
        field: {
          input: {
            colors: {
              gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-slate-500 focusxx:ring-slate-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400"
            }
          }
        }
      }}
    />
  </div>
);