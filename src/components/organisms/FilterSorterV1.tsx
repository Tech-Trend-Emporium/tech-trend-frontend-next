import { Checklist } from "../molecules/checklist";
import { DropdownField } from "../atoms/DropDownField";
import { Button, type CardProps, type CheckboxFieldProps } from "../atoms";
import { ItemGrid } from "../molecules/CardsGrid";

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
  errorMessage,
  handleSelect,
  onClick,
  required,
}: filterSorterProps) => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
    <h1 className="text-6xl font-bold pb-8 text-gray-900 dark:text-white">Shop</h1>

    <p className="text-xl pb-6 text-gray-700 dark:text-gray-300">
      At Tech Trend Emporium, every product is the result of a clear vision: to combine innovation, sustainability and superior quality in every detail.
      Our collection is carefully designed for those who seek technology that not only enhances their daily lives, but also respects the planet and stands the test of time.
    </p>

    <p className="text-xl pb-10 text-gray-700 dark:text-gray-300">
      Discover devices and accessories created with responsible materials, efficient processes and the highest standard of performance.
      Each item reflects our commitment to the future: a future where smart technology and environmental awareness go hand in hand.
    </p>

    <div className="flex flex-col lg:flex-row gap-10">
      <aside className="flex-shrink-0 lg:w-auto">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Filter</h2>
        <Checklist items={filterItems} />
      </aside>
      <section className="flex-1 flex flex-col">
        <div className="self-end mb-8">
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

        <div>
          <ItemGrid itemCardsData={dataSet} />
        </div>

        <div className="flex justify-center mt-10">
          <Button
            type="submit"
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
      </section>
    </div>
  </div>
);
