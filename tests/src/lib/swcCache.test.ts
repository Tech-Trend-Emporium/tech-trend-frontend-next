import { describe, it, expect, vi, beforeEach } from "vitest";
import { swcGet } from "@/src/lib/swcCache";

type Entry<T> = {
    value: T;
    storedAt: number;
    ttlMs: number;
};

const storageKey = (k: string) => `swc:${k}`;

describe("swcGet", () => {
    let mockStore: Record<string, string> = {};
    let now = 1000;

    beforeEach(() => {
        mockStore = {};
        now = 1000;

        // mock localStorage
        global.localStorage = {
            getItem: vi.fn((k: string) => mockStore[k] ?? null),
            setItem: vi.fn((k: string, v: string) => { mockStore[k] = v; }),
            removeItem: vi.fn(),
            clear: vi.fn(),
            key: vi.fn(),
            length: 0,
        };

        // mock Date.now
        vi.spyOn(Date, "now").mockImplementation(() => now);
    });

    const advanceTime = (ms: number) => {
        now += ms;
    };

    it("returns value from loader and stores it when cache empty", async () => {
        const loader = vi.fn().mockResolvedValue("fresh-data");

        const result = await swcGet("key1", 5000, loader);

        expect(result).toBe("fresh-data");
        expect(loader).toHaveBeenCalledTimes(1);

        const stored = JSON.parse(mockStore[storageKey("key1")]) as Entry<string>;
        expect(stored.value).toBe("fresh-data");
    });

    it("returns value from in-memory cache when not expired", async () => {
        const loader = vi.fn().mockResolvedValue("fresh-data");

        // FIRST CALL loads and caches
        await swcGet("k2", 5000, loader);

        loader.mockClear(); // reset call count

        // SECOND CALL should read from mem, not call loader
        const result = await swcGet("k2", 5000, loader);

        expect(result).toBe("fresh-data");
        expect(loader).not.toHaveBeenCalled();
    });

    it("returns value from localStorage when memory is empty but localStorage not expired", async () => {
        const entry: Entry<string> = {
            value: "stored-value",
            storedAt: now,
            ttlMs: 5000,
        };

        mockStore[storageKey("k3")] = JSON.stringify(entry);

        const loader = vi.fn().mockResolvedValue("fresh-after");

        const result = await swcGet("k3", 5000, loader);

        expect(result).toBe("stored-value");

        // loader is called IN BACKGROUND but not awaited
        expect(loader).toHaveBeenCalledTimes(1);
    });

    it("loads fresh value when localStorage entry expired", async () => {
        const entry: Entry<string> = {
            value: "old-value",
            storedAt: now - 10000,
            ttlMs: 5000,
        };

        mockStore[storageKey("k4")] = JSON.stringify(entry);

        const loader = vi.fn().mockResolvedValue("new-value");

        const result = await swcGet("k4", 5000, loader);

        expect(result).toBe("new-value");
        expect(loader).toHaveBeenCalledTimes(1);
    });

    it("loads fresh value when JSON in localStorage is invalid", async () => {
        mockStore[storageKey("k5")] = "INVALID_JSON";

        const loader = vi.fn().mockResolvedValue(123);

        const result = await swcGet("k5", 5000, loader);

        expect(result).toBe(123);
        expect(loader).toHaveBeenCalledTimes(1);
    });

    it("updates localStorage asynchronously with fresh value when localStorage entry is valid but cached", async () => {
        const entry: Entry<string> = {
            value: "old",
            storedAt: now,
            ttlMs: 5000,
        };

        mockStore[storageKey("k6")] = JSON.stringify(entry);

        const loader = vi.fn().mockResolvedValue("fresh");

        const result = await swcGet("k6", 5000, loader);

        expect(result).toBe("old");

        // run pending microtasks
        await Promise.resolve();

        const stored = JSON.parse(mockStore[storageKey("k6")]) as Entry<string>;
        expect(stored.value).toBe("fresh");
    });

    it("loader is not called while cached value is still valid in memory", async () => {
        const loader = vi.fn().mockResolvedValue("data");

        await swcGet("k7", 5000, loader); // initial load
        loader.mockClear();

        const result = await swcGet("k7", 5000, loader);

        expect(result).toBe("data");
        expect(loader).not.toHaveBeenCalled();
    });

    it("refreshes loader result only after TTL expires", async () => {
        const loader = vi.fn().mockResolvedValue("initial");

        await swcGet("k8", 1000, loader);

        loader.mockResolvedValue("after-expire");
        loader.mockClear();

        advanceTime(2000);

        const result = await swcGet("k8", 1000, loader);

        expect(result).toBe("after-expire");
        expect(loader).toHaveBeenCalledTimes(1);
    });
});
