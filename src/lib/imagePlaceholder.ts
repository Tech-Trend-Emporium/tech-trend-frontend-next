import { Providers } from "./imageProvider";


const KEYWORDS: Record<string, string> = {
    "men's clothing": "mens fashion,clothes,apparel,studio,retail,model",
    "women's clothing": "womens fashion,clothes,apparel,studio,retail,model",
    "jewelery": "jewelry,necklace,ring,bracelet,product,studio,macro",
    "electronics": "electronics,gadgets,devices,tech,product,studio",
};

const slugify = (s: string) =>
    s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export const categoryImage = (name: string, w = 640, h = 400) => {
    const pretty = name.trim().toLowerCase();
    slugify(pretty);
    const kw = KEYWORDS[pretty] ?? "shopping,retail,product,studio";

    return Providers.buildPicsum(kw, w, h);
};