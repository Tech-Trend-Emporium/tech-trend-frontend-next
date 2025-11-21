"use client";

import { ProductResponse } from "@/src/models";
import { CardProps } from "../components";


export const mapProducts = (productsArray: ProductResponse[]): CardProps[] => {
  return (productsArray.map((p) => ({
    id: p.id,
    image: p.imageUrl,
    title: p.title,
    price: p.price,
    category: p.category,
  })));
};
