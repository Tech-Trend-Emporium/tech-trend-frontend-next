import { CardProps, ItemCard } from "../";


export interface ItemGridProps {
  itemCardsData: CardProps[];
}

export const ItemGrid = ({ itemCardsData }: ItemGridProps) => {
  return (
    <section className="py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 lg:gap-8">
        {itemCardsData.map((item, index) => (
          <ItemCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
};