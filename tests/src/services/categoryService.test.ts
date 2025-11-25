import { describe, it, expect, beforeEach, vi } from "vitest";
import { CategoryService } from "@/src/services/categoryService";
import { http } from "@/src/lib";
import { AxiosError } from "axios";

// Mock de http
vi.mock("@/src/lib", () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    }
}));

const sampleCategoryRaw = {
    id: 1,
    name: "Books",
    createdAt: Date.now().toString,
    updatedAt: "2024-01-02T00:00:00Z",
};

const sampleApprovalJobRaw = {
    id: 99,
    requestedAt: "2024-01-01T00:00:00Z",
    decidedAt: null,
};

describe("CategoryService", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ---------------------------------------------------------
    // getById
    // ---------------------------------------------------------
    describe("getById", () => {
        it("Success → Maps the category well", async () => {
            (http.get as any).mockResolvedValue({ data: sampleCategoryRaw });

            const result = await CategoryService.getById(1);

            expect(result.id).toBe(1);
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(http.get).toHaveBeenCalledWith("/Category/1");
        });

        it("fail → Not found", async () => {
            const err = new AxiosError('Not found', '404');
            (http.get as any).mockRejectedValue(new Error("Network"));

            await expect(CategoryService.getById(1)).rejects.toThrow("Network");
        });

    });

    // ---------------------------------------------------------
    // list
    // ---------------------------------------------------------
    describe("list", () => {
        it("Success → Maps the list correctly", async () => {
            (http.get as any).mockResolvedValue({
                data: {
                    total: 1,
                    items: [sampleCategoryRaw],
                },
            });

            const result = await CategoryService.list();

            expect(result.total).toBe(1);
            expect(result.items[0].createdAt).toBeInstanceOf(Date);

            expect(http.get).toHaveBeenCalledWith("/Category", {
                params: { skip: 0, take: 50 }
            });
        });

        it("Fail → List empty", async () => {
            const err = new AxiosError('Not found', '404');
            (http.get as any).mockRejectedValue(err);

            await expect(CategoryService.list()).rejects.toThrow(err);
        });
    });

    // ---------------------------------------------------------
    // create
    // ---------------------------------------------------------
    describe("create", () => {
        it("Success → Created succesfully", async () => {
            (http.post as any).mockResolvedValue({
                status: 201,
                data: sampleCategoryRaw
            });

            const result = await CategoryService.create({ name: "Books" });
            expect(result.kind).toBe("created");
        });

        it("Success → 202 accepted", async () => {
            (http.post as any).mockResolvedValue({
                status: 202,
                data: {
                    message: "Pending approval",
                    approvalJob: sampleApprovalJobRaw
                }
            });

            const result = await CategoryService.create({ name: "Books" });

            expect(result.kind).toBe("accepted");
        });

        it("Fail → Validation error", async () => {
            const err = new AxiosError('Bad request', '404');
            (http.post as any).mockRejectedValue(err);

            await expect(CategoryService.create({ name: "X" })).rejects.toThrow(err);
        });
        
        it("Fail → Category already exist", async () => {
            const err = new AxiosError('Conflict', '409');
            (http.post as any).mockRejectedValue(err);

            await expect(CategoryService.create({ name: "Y" })).rejects.toThrow(err);
        });

    });

    // ---------------------------------------------------------
    // update
    // ---------------------------------------------------------
    describe("update", () => {
        it("Succes → Category updated", async () => {
            
            (http.put as any).mockResolvedValue({data: { ...sampleCategoryRaw, name: 'Updated' }});

            const r = await CategoryService.update(1, { name: "Updated" });

            expect(r.name).toBe("Updated");
            expect(r.createdAt).toBeInstanceOf(Date);
        });

        it("Fail → Not found", async () => {
            const err = new AxiosError('Not found', '404');
            (http.put as any).mockRejectedValue(err);

            await expect(CategoryService.update(1, { name: "X" })).rejects.toThrow(err);
        });

        
    });

    // ---------------------------------------------------------
    // remove
    // ---------------------------------------------------------
    describe("remove", () => {
        it("Success → 204 no-content", async () => {
            (http.delete as any).mockResolvedValue({
                status: 204,
                data: undefined
            });

            const r = await CategoryService.remove(1);

            expect(r.kind).toBe("no-content");
        });

        it("éxito → 202 accepted", async () => {
            (http.delete as any).mockResolvedValue({
                status: 202,
                data: {
                    message: "Approval required",
                    approvalJob: sampleApprovalJobRaw
                }
            });

            const result = await CategoryService.remove(1);

            expect(result.kind).toBe("accepted");
        });

        it("Fail → Category does not exist", async () => {
            const err = new AxiosError('Not Found', '404');
            (http.delete as any).mockRejectedValue(err);

            await expect(CategoryService.remove(1)).rejects.toThrow(err);
        });
    });

});
