"use client";

type Loader<T> = () => Promise<T>;

type Entry<T> = {
    value: T;
    storedAt: number; 
    ttlMs: number;
};

const mem = new Map<string, Entry<unknown>>();

const storageKey = (key: string) => `swc:${key}`;

export const swcGet = async <T>(key: string, ttlMs: number, loader: Loader<T>): Promise<T> => {
    const inMem = mem.get(key) as Entry<T> | undefined;
    const now = Date.now();
    if (inMem && now - inMem.storedAt < inMem.ttlMs) return inMem.value;

    const raw = localStorage.getItem(storageKey(key));
    if (raw) {
        try {
            const parsed = JSON.parse(raw) as Entry<T>;
            if (now - parsed.storedAt < parsed.ttlMs) {
                mem.set(key, parsed);

                loader().then((fresh) => {
                    const ent: Entry<T> = { value: fresh, storedAt: Date.now(), ttlMs };

                    mem.set(key, ent);
                    localStorage.setItem(storageKey(key), JSON.stringify(ent));
                }).catch(() => {});
                
                return parsed.value;
            }
        } catch {}
    }

    const value = await loader();
    const entry: Entry<T> = { value, storedAt: now, ttlMs };
    
    mem.set(key, entry);
    localStorage.setItem(storageKey(key), JSON.stringify(entry));
    
    return value;
};