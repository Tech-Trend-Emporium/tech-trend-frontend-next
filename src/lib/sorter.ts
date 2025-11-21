import { CardProps } from "@/src/components";


export type SortOption = "A to Z" | "Z to A" | "Price asc" | "Price desc" | "Default";

const COMPARATORS: Record<Exclude<SortOption, "Default">, (a: CardProps, b: CardProps) => number> = {
    "A to Z": (a, b) => a.title.localeCompare(b.title),
    "Z to A": (a, b) => b.title.localeCompare(a.title),
    "Price asc": (a, b) => (a.price ?? 0) - (b.price ?? 0),
    "Price desc": (a, b) => (b.price ?? 0) - (a.price ?? 0),
};

export const sortCards = (cards: CardProps[], option: SortOption) => {
    if (option === "Default") return cards;
    
    return [...cards].sort(COMPARATORS[option]);
};