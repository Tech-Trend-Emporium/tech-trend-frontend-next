import { ProductService } from "@/src/services";
import { saveCache } from "@/src/utils";
import * as React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";


type SearchBarProps = {
  placeholder?: string;
  value?: string; // make it controllable if you want
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
  inputClassName?: string;
  inputId?: string; // in case you need multiple on a page
};

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search…",
  value,
  onChange,
  onSubmit,
  className = "",
  inputClassName = "",
  inputId = "navbar-search",
}) => {
  const [internalValue, setInternalValue] = React.useState("");
  
  const v = value ?? internalValue;

  const setV = (val: string) => {
    if (onChange) onChange(val);
    else setInternalValue(val);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(v);
  };

  //Ante cualquier busqueda, reviso la caché.
  //Cuando añadan un producto, lo añado a la caché,
  //Cuando quitan un producto, lo quito de la caché,
  //Cuando actualicen un producto, lo antualizo en la caché

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={[
        // container
        "flex items-center gap-2 rounded-xl border",
        "border-slate-300 dark:border-slate-600",
        "bg-white/70 dark:bg-slate-800/70 backdrop-blur",
        "px-3 py-1.5",
        "focus-within:ring-1 focus-within:ring-sky-300",
        "transition-shadow",
        className,
      ].join(" ")}
    >
      {/* Left icon (decorative) */}
      <button type="submit" className="text-slate-300" >
        <FaMagnifyingGlass />
      </button>

      {/* Accessible label for screen readers */}
      <label htmlFor={inputId} className="sr-only">
        Search
      </label>

      {/* Input */}
      <input
        id={inputId}
        type="search"
        placeholder={placeholder}
        value={v}
        onChange={(e) => setV(e.target.value)}
        className={[
          "w-full bg-transparent",
          "border-0 p-0 text-black dark:text-white",
          "focus:ring-0 focus:outline-none",
          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
          inputClassName,
        ].join(" ")}
      />
    </form>
  );
};