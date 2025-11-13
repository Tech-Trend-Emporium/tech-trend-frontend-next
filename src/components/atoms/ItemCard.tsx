import Image from "next/image";


interface CardProps {
  image: string;
  title: string;
  price?: number; 
  ctaText?: string;
}

export const ItemCard = ({ image, title, price, ctaText }: CardProps) => {
  const isPriceVisible = typeof price === "number" && !Number.isNaN(price);
  return (
    <div className="flex flex-col justify-center items-center p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden 
                  hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700">
      <div className="relative w-full h-48 p-2">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, 33vw"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-center">
          {title}
        </h3>

        {isPriceVisible ? (
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            ${price!.toFixed(2)}
          </span>
        ) : (
          <span className="text-xs uppercase tracking-wide bg-gray-900/10 text-gray-800 dark:bg-gray-600 dark:text-gray-100 px-3 py-1 rounded-full">
            {ctaText ?? "Explore"}
          </span>
        )}
      </div>
    </div>
  );
};