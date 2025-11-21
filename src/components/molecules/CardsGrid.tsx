import { ItemCard, type CardProps } from "../atoms/ItemCard";

export interface ItemGridProps {
  itemCardsData: CardProps[]
}

export const ItemGrid = ({ itemCardsData }: ItemGridProps) => {
  return (
    <section className="py-12 px-4 sm:px-8 lg:px-16 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
      >
        {itemCardsData.map((item, index) => (
          <ItemCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
};
