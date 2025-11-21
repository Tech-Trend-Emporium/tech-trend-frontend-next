import { ProductResponse } from "@/src/models";
import { CardProps } from "@/src/components";


export const toCards = (
    items: ProductResponse[],
    onNavigate: (id: string) => void
): CardProps[] => {
    return items.map((p) => ({
        id: p.id,
        image: p.imageUrl,
        title: p.title,
        price: p.price,
        category: p.category,
        onClick: () => onNavigate((p.id).toString()),
    }));
}