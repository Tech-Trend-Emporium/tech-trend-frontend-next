import { Button, CardProps, CheckboxFieldProps, Checklist, DropdownField, ItemGrid } from "../";


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

export const FilterSorter = ({
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
  const hasItems = dataSet.length > 0;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
          Shop
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover tech designed with performance, durability, and sustainability in mind.
        </p>

        {/* Call-to-action */}
        {hasItems && (
          <Button variant="outline" className="mt-6 hover:cursor-pointer">
            Shop All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        <aside className="lg:sticky lg:top-8 h-fit">
          <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-md ring-1 ring-gray-200/60 dark:ring-gray-700/50">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/70">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <span className="w-1 h-6 bg-gray-900 dark:bg-gray-200 rounded-full mr-3"></span>
                Filter
              </h2>
            </div>
            <div className="p-5">
              <Checklist items={filterItems} />
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="flex-1 flex flex-col">
          <div className="flex items-center justify-end mb-6">
            <div className="w-full sm:w-auto">
              <DropdownField
                id={id}
                label={label}
                name={name}
                options={options}
                selected={selected}
                handleSelect={handleSelect}
                required={required}
              />
            </div>
          </div>

          {/* Grid */}
          {hasItems ? (
            <>
              <ItemGrid itemCardsData={dataSet} />

              {/* CTA Show more */}
              <div className="flex justify-center mt-8">
                <Button
                  type="button"
                  variant={submitButton.variant || "dark"}
                  fullWidth={false}
                  disabled={submitButton.disabled}
                  isLoading={submitButton.isLoading}
                  className="font-semibold"
                  onClick={onClick}
                >
                  {submitButton.text}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16 rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/50">
              <svg
                className="mx-auto h-20 w-20 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"
                />
              </svg>
              <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                No products to show
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Try adjusting the filters or sorting options.
              </p>
              <div className="mt-6">
                <Button variant="outline" onClick={onClick}>
                  Load More
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};