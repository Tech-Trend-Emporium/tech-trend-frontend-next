import { Button, CardProps, CheckboxFieldProps, Checklist, DropdownField, ItemGrid } from "@/src/components";


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
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Shop
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover tech designed with performance, durability, and sustainability in mind.
        </p>
        {hasItems && (
          <Button variant="outline" className="mt-6 hover:cursor-pointer">
            Shop All
          </Button>
        )}
      </div>

      {/* Main Layout - Wider container */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-8">
        {/* Sidebar Filter */}
        <aside className="lg:mt-11 lg:sticky lg:top-8 h-fit">
          <div className="rounded-2xl bg-white dark:bg-gray-800/80 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/50">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
                <span className="w-1 h-6 bg-gray-800 dark:bg-gray-200 rounded-full mr-3"></span>
                Filters
              </h2>
            </div>
            <div className="p-5">
              <Checklist items={filterItems} />
            </div>
          </div>
        </aside>

        {/* Products Section */}
        <section className="flex-1 flex flex-col min-w-0">
          {/* Sort Dropdown Row - Added relative and z-index */}
          <div className="flex items-center justify-between mb-6 gap-4 relative z-20">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {hasItems ? `${dataSet.length} product${dataSet.length !== 1 ? 's' : ''} found` : 'No products found'}
            </p>
            <div className="w-44 relative z-20">
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

          {/* Product Grid or Empty State */}
          {hasItems ? (
            <>
              <ItemGrid itemCardsData={dataSet} />
              <div className="flex justify-center mt-10">
                <Button
                  type="button"
                  variant={submitButton.variant || "dark"}
                  fullWidth={false}
                  disabled={submitButton.disabled}
                  isLoading={submitButton.isLoading}
                  className="px-8 py-3 font-semibold"
                  onClick={onClick}
                >
                  {submitButton.text}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16 sm:py-20 rounded-2xl bg-white dark:bg-gray-800/80 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/60">
              <svg
                className="mx-auto h-20 w-20 text-gray-300 dark:text-gray-600"
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
              <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
                No products to show
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                Try adjusting the filters or sorting options to find what you&apos;re looking for.
              </p>
              <Button variant="outline" className="mt-8" onClick={onClick}>
                Load More
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};