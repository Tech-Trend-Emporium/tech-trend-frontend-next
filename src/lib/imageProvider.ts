const buildUnsplash = (kw: string, w: number, h: number) =>
    `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(kw)}`;

const buildLoremFlickr = (kw: string, w: number, h: number) =>
    `https://loremflickr.com/${w}/${h}/${encodeURIComponent(kw)}`;

const buildPicsum = (slug: string, w: number, h: number) =>
    `https://picsum.photos/seed/${slug}/${w}/${h}`;

export const Providers = { buildUnsplash, buildLoremFlickr, buildPicsum };