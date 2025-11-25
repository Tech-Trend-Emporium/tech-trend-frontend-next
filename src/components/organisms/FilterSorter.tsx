import { memo, useMemo } from "react";
import { Button, CardProps, CheckboxFieldProps, ProductsGrid, SidebarFilters } from "@/src/components";


interface filterSorterProps {
  filterItems: CheckboxFieldProps[];
  dataSet: CardProps[];
  submitButton: {
    text: string;
    disabled?: boolean;
    isLoading?: boolean;
    variant?: "primary" | "secondary" | "outline" | "danger" | "dark";
  };
  id: string;
  name: string;
  label: string;
  options: string[];
  selected: string;
  errorMessage?: string;
  handleSelect: (value: string) => void;
  onClick: () => void;
  required?: boolean;
}

const FilterSorterInner = ({
  filterItems,
  dataSet,
  submitButton,
  id,
  name,
  label,
  options,
  selected,
  handleSelect,
  onClick,
  required,
}: filterSorterProps) => {
  const hasItems = useMemo(() => dataSet.length > 0, [dataSet.length]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Shop</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover tech designed with performance, durability, and sustainability in mind.
        </p>
        {hasItems && (
          <Button variant="outline" className="mt-6 hover:cursor-pointer">
            Shop All
          </Button>
        )}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-8">
        <SidebarFilters items={filterItems} />
        <ProductsGrid
          id={id}
          name={name}
          label={label}
          options={options}
          selected={selected}
          required={required}
          dataSet={dataSet}
          submitButton={submitButton}
          handleSelect={handleSelect}
          onClick={onClick}
        />
      </div>
    </div>
  );
}

const areEqual = (prev: Readonly<filterSorterProps>, next: Readonly<filterSorterProps>) => {
  const sameFilterLen = prev.filterItems.length === next.filterItems.length;
  const sameDataLen = prev.dataSet.length === next.dataSet.length;
  const sameSubmit =
    prev.submitButton.text === next.submitButton.text &&
    prev.submitButton.disabled === next.submitButton.disabled &&
    prev.submitButton.isLoading === next.submitButton.isLoading &&
    (prev.submitButton.variant || "dark") === (next.submitButton.variant || "dark");
  const sameSortMeta =
    prev.id === next.id &&
    prev.name === next.name &&
    prev.label === next.label &&
    prev.selected === next.selected &&
    prev.required === next.required;
  const sameOptions = prev.options.length === next.options.length;

  return (
    sameFilterLen &&
    sameDataLen &&
    sameSubmit &&
    sameSortMeta &&
    sameOptions &&
    prev.handleSelect === next.handleSelect &&
    prev.onClick === next.onClick
  );
}

export const FilterSorter = memo(FilterSorterInner, areEqual);