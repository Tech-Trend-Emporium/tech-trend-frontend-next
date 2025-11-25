import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReviewService } from "@/src/services/reviewService";

// Mock del módulo http
vi.mock("@/src/lib", () => {
    return {
        http: {
            get: vi.fn(),
            post: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        },
    };
});

import { http } from "@/src/lib";

const sampleRaw = {
    id: 1,
    username: "kevin",
    productId: 10,
    comment: "Nice product",
    rating: 5,
};

describe("ReviewService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ----------------------------------------------------------------------
    // GET BY ID
    // ----------------------------------------------------------------------
    it("getById → maps ReviewResponseRaw to ReviewResponse", async () => {
        (http.get as any).mockResolvedValue({ data: sampleRaw });

        const result = await ReviewService.getById(1);

        expect(http.get).toHaveBeenCalledWith("/Review/1");
        expect(result).toEqual(sampleRaw);
    });

    it("getById → throws error on failure", async () => {
        (http.get as any).mockRejectedValue(new Error("GET_FAILED"));

        await expect(ReviewService.getById(3)).rejects.toThrow("GET_FAILED");
    });

    // ----------------------------------------------------------------------
    // LIST
    // ----------------------------------------------------------------------
    it("list → returns mapped page", async () => {
        const pageRaw = {
            total: 1,
            items: [sampleRaw],
        };

        (http.get as any).mockResolvedValue({ data: pageRaw });

        const result = await ReviewService.list({ skip: 5, take: 20 });

        expect(http.get).toHaveBeenCalledWith("/Review", {
            params: { skip: 5, take: 20 },
        });

        expect(result).toEqual({
            total: 1,
            items: [sampleRaw],
        });
    });

    it("list → uses defaults when no opts provided", async () => {
        (http.get as any).mockResolvedValue({ data: { total: 0, items: [] } });

        await ReviewService.list();

        expect(http.get).toHaveBeenCalledWith("/Review", {
            params: { skip: 0, take: 50 },
        });
    });

    it("list → throws error on failure", async () => {
        (http.get as any).mockRejectedValue(new Error("LIST_ERROR"));

        await expect(ReviewService.list()).rejects.toThrow("LIST_ERROR");
    });

    // ----------------------------------------------------------------------
    // LIST BY PRODUCT
    // ----------------------------------------------------------------------
    it("listByProduct → returns mapped page", async () => {
        const pageRaw = {
            total: 1,
            items: [sampleRaw],
        };

        (http.get as any).mockResolvedValue({ data: pageRaw });

        const result = await ReviewService.listByProduct(10, { skip: 2, take: 5 });

        expect(http.get).toHaveBeenCalledWith("/Review/product/10", {
            params: { skip: 2, take: 5 },
        });

        expect(result).toEqual({
            total: 1,
            items: [sampleRaw],
        });
    });

    it("listByProduct → throws error on failure", async () => {
        (http.get as any).mockRejectedValue(new Error("PROD_ERROR"));

        await expect(ReviewService.listByProduct(5)).rejects.toThrow("PROD_ERROR");
    });

    // ----------------------------------------------------------------------
    // CREATE
    // ----------------------------------------------------------------------
    it("create → posts data and returns mapped response", async () => {
        (http.post as any).mockResolvedValue({ data: sampleRaw });

        const payload = {
            username: "kevin",
            productId: 10,
            comment: "Nice",
            rating: 5,
        };

        const result = await ReviewService.create(payload);

        expect(http.post).toHaveBeenCalledWith("/Review", payload);
        expect(result).toEqual(sampleRaw);
    });

    it("create → throws on failure", async () => {
        (http.post as any).mockRejectedValue(new Error("CREATE_ERROR"));

        await expect(
            ReviewService.create({
                username: "x",
                productId: 1,
                rating: 2,
            })
        ).rejects.toThrow("CREATE_ERROR");
    });

    // ----------------------------------------------------------------------
    // UPDATE
    // ----------------------------------------------------------------------
    it("update → sends patch and returns mapped response", async () => {
        (http.patch as any).mockResolvedValue({ data: sampleRaw });

        const payload = { comment: "updated" };

        const result = await ReviewService.update(1, payload);

        expect(http.patch).toHaveBeenCalledWith("/Review/1", payload);
        expect(result).toEqual(sampleRaw);
    });

    it("update → throws on failure", async () => {
        (http.patch as any).mockRejectedValue(new Error("UPDATE_ERROR"));

        await expect(ReviewService.update(1, { rating: 3 })).rejects.toThrow("UPDATE_ERROR");
    });

    // ----------------------------------------------------------------------
    // DELETE
    // ----------------------------------------------------------------------
    it("remove → sends delete request", async () => {
        (http.delete as any).mockResolvedValue({ data: undefined });

        const result = await ReviewService.remove(7);

        expect(http.delete).toHaveBeenCalledWith("/Review/7");
        expect(result).toBe(undefined);
    });

    it("remove → throws on failure", async () => {
        (http.delete as any).mockRejectedValue(new Error("DELETE_ERROR"));

        await expect(ReviewService.remove(9)).rejects.toThrow("DELETE_ERROR");
    });
});
