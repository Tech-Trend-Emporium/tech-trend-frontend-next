import { describe, it, expect } from "vitest";
import { sortCards, type SortOption } from "@/src/lib/sorter";
import { CardProps } from "@/src/components";



const sampleCards: CardProps[] = [
    { id: 1, title: "Banana", price: 5, image:"Hello" },
    { id: 2, title: "Apple", price: 10, image:"Hello" },
    { id: 3, title: "Orange", price: 1, image:"Hello" },
];

describe("sortCards", () => {

    it("should return the original array when option is 'Default'", () => {
        const result = sortCards(sampleCards, "Default");

        // Regresa el mismo arreglo, sin clonar
        expect(result).toBe(sampleCards);
    });

    it("should sort A to Z by title", () => {
        const result = sortCards(sampleCards, "A to Z");

        expect(result.map(x => x.title)).toEqual(["Apple", "Banana", "Orange"]);
    });

    it("should sort Z to A by title", () => {
        const result = sortCards(sampleCards, "Z to A");

        expect(result.map(x => x.title)).toEqual(["Orange", "Banana", "Apple"]);
    });

    it("should sort by price ascending", () => {
        const result = sortCards(sampleCards, "Price asc");

        expect(result.map(x => x.price)).toEqual([1, 5, 10]);
    });

    it("should sort by price descending", () => {
        const result = sortCards(sampleCards, "Price desc");

        expect(result.map(x => x.price)).toEqual([10, 5, 1]);
    });

    it("should treat undefined price as 0 when sorting asc", () => {
        const data = [
            { id: 1, title: "A", price: undefined, image:"Hello" },
            { id: 2, title: "B", price: 5, image:"Hello" },
        ];

        const result = sortCards(data, "Price asc");

        expect(result.map(x => x.price)).toEqual([undefined, 5]);
    });

    it("should treat undefined price as 0 when sorting desc", () => {
        const data = [
            { id: 1, title: "A", price: undefined, image:"Hello" },
            { id: 2, title: "B", price: 5, image:"Hello" },
        ];

        const result = sortCards(data, "Price desc");

        expect(result.map(x => x.price)).toEqual([5, undefined]);
    });

    it("should not mutate the original array for non-default sorting", () => {
        const original = [...sampleCards];
        sortCards(sampleCards, "A to Z");

        expect(sampleCards).toEqual(original); // original intact
    });

});
