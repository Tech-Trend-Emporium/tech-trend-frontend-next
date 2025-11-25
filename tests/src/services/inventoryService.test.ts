import { describe, it, expect, vi, beforeEach } from "vitest";
import { InventoryService } from "@/src/services/inventoryService";
import { http } from "@/src/lib";

// Mock del módulo http
vi.mock("@/src/lib", () => ({
    http: {
        get: vi.fn(),
    },
}));

describe("InventoryService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ===========================
    //        list()
    // ===========================

    it("should return a list of inventory items", async () => {
        const mockResponse = {
            data: {
                total: 2,
                items: [
                    { id: 1, total: 10, available: 5, productName: "A" },
                    { id: 2, total: 8, available: 3, productName: "B" },
                ],
            },
        };

        (http.get as any).mockResolvedValue(mockResponse);

        const result = await InventoryService.list({ skip: 0, take: 50 });

        expect(http.get).toHaveBeenCalledWith("/Inventory", {
            params: { skip: 0, take: 50 },
        });

        expect(result).toEqual({
            total: 2,
            items: mockResponse.data.items,
        });
    });

    it("should use default skip/take when no opts are provided", async () => {
        const mockResponse = {
            data: {
                total: 1,
                items: [
                    { id: 99, total: 100, available: 50, productName: "Laptop" },
                ],
            },
        };

        (http.get as any).mockResolvedValue(mockResponse);

        const result = await InventoryService.list();

        expect(http.get).toHaveBeenCalledWith("/Inventory", {
            params: { skip: 0, take: 50 },
        });

        expect(result).toEqual({
            total: 1,
            items: mockResponse.data.items,
        });
    });

    // ===========================
    //         Errors
    // ===========================

    it("should throw an error when http.get rejects", async () => {
        const error = new Error("Network failure");

        (http.get as any).mockRejectedValue(error);

        await expect(InventoryService.list()).rejects.toThrow("Network failure");
    });

    it("should propagate custom error messages", async () => {
        const error = new Error("Invalid query");

        (http.get as any).mockRejectedValue(error);

        await expect(InventoryService.list()).rejects.toThrow("Invalid query");
    });
});
