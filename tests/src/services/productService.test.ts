import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductService } from "@/src/services/productService";

// Importamos AxiosError para fallas
import { AxiosError } from "axios";

// Mock manual de http
vi.mock("@/src/lib", () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

import { http } from "@/src/lib";

// Utilidad para fechas
const iso = (d: string) => new Date(d).toISOString();

const sampleRawProduct = {
    id: 1,
    title: "Test Product",
    price: 10,
    description: "desc",
    imageUrl: "http://img",
    ratingRate: 5,
    count: 3,
    category: "books",
    createdAt: iso("2023-01-01"),
    updatedAt: iso("2023-01-02"),
};

const sampleApprovalJob = {
    id: 99,
    status: "pending",
    requestedAt: iso("2023-01-05"),
    decidedAt: null,
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("ProductService.getById", () => {
    it("should return mapped product", async () => {
        (http.get as any).mockResolvedValue({ data: sampleRawProduct });

        const r = await ProductService.getById(1);

        expect(r.id).toBe(1);
        expect(r.createdAt instanceof Date).toBe(true);
        expect(r.updatedAt instanceof Date).toBe(true);
        expect(http.get).toHaveBeenCalledWith("/Product/1");
    });

    it("should throw axios error", async () => {
        const error = new AxiosError("Get failed", "E_GET");
        (http.get as any).mockRejectedValue(error);

        await expect(ProductService.getById(1)).rejects.toThrow("Get failed");
    });
});

describe("ProductService.getByName", () => {
    it("should map product by name", async () => {
        (http.get as any).mockResolvedValue({ data: sampleRawProduct });

        const r = await ProductService.getByName("Test Product");

        expect(r.title).toBe("Test Product");
        expect(http.get).toHaveBeenCalledWith("/Product/Test Product");
    });
});

describe("ProductService.list", () => {
    it("should return list with mapped products", async () => {
        (http.get as any).mockResolvedValue({
            data: {
                total: 1,
                items: [sampleRawProduct],
            },
        });

        const r = await ProductService.list({ skip: 5, take: 10, category: "books" });

        expect(r.total).toBe(1);
        expect(r.items[0].createdAt instanceof Date).toBe(true);
        expect(http.get).toHaveBeenCalledWith("/Product", {
            params: {
                skip: 5,
                take: 10,
                category: "books",
            },
        });
    });

    it("should handle default params", async () => {
        (http.get as any).mockResolvedValue({
            data: { total: 0, items: [] },
        });

        await ProductService.list();

        expect(http.get).toHaveBeenCalledWith("/Product", {
            params: { skip: 0, take: 50, category: undefined },
        });
    });

    it("should throw axios error", async () => {
        const error = new AxiosError("List failed", "E_LIST");
        (http.get as any).mockRejectedValue(error);

        await expect(ProductService.list()).rejects.toThrow("List failed");
    });
});

describe("ProductService.create", () => {
    it("should return created result", async () => {
        (http.post as any).mockResolvedValue({
            status: 201,
            data: sampleRawProduct,
        });

        const payload = { title: "X", price: 10, category: "books" };

        const r = await ProductService.create(payload);

        expect(r.kind).toBe("created");
    });

    it("should return accepted result (202)", async () => {
        (http.post as any).mockResolvedValue({
            status: 202,
            data: {
                message: "Pending approval",
                approvalJob: sampleApprovalJob,
            },
        });

        const payload = { title: "X", price: 10, category: "books" };

        const r = await ProductService.create(payload);

        expect(r.kind).toBe("accepted");
    });

    it("should throw axios error", async () => {
        const error = new AxiosError("Create failed", "E_CREATE");
        (http.post as any).mockRejectedValue(error);

        await expect(ProductService.create({ title: "X", price: 20, category: "cat" }))
            .rejects.toThrow("Create failed");
    });
});

describe("ProductService.update", () => {
    it("should map updated product", async () => {
        (http.patch as any).mockResolvedValue({ data: sampleRawProduct });

        const r = await ProductService.update(1, { title: "New" });

        expect(r.title).toBe("Test Product");
        expect(r.createdAt instanceof Date).toBe(true);
        expect(http.patch).toHaveBeenCalledWith("/Product/1", { title: "New" });
    });

    it("should throw axios error", async () => {
        const error = new AxiosError("Update failed", "E_UPDATE");
        (http.patch as any).mockRejectedValue(error);

        await expect(ProductService.update(1, {})).rejects.toThrow("Update failed");
    });
});

describe("ProductService.remove", () => {
    it("should return no-content when 204", async () => {
        (http.delete as any).mockResolvedValue({
            status: 204,
            data: undefined,
        });

        const r = await ProductService.remove(1);

        expect(r.kind).toBe("no-content");
    });

    it("should return accepted when 202", async () => {
        (http.delete as any).mockResolvedValue({
            status: 202,
            data: {
                message: "Pending approval",
                approvalJob: sampleApprovalJob,
            },
        });

        const r = await ProductService.remove(1);

        expect(r.kind).toBe("accepted");
    });

    it("should throw axios error", async () => {
        const error = new AxiosError("Delete failed", "E_DELETE");
        (http.delete as any).mockRejectedValue(error);

        await expect(ProductService.remove(1)).rejects.toThrow("Delete failed");
    });
});
