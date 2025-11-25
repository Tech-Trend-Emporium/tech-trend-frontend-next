import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserService } from "@/src/services/userService";

// Mock manual del módulo http
vi.mock("@/src/lib", () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

import { http } from "@/src/lib";
import { CreateUserRequest } from "@/src/models";

const sampleRaw = {
    id: 1,
    username: "kevin",
    email: "kevin@mail.com",
    role: "Admin",
    isActive: true,
    createdAt: "2024-01-10T12:00:00.000Z",
    updatedAt: "2024-02-10T15:00:00.000Z",
};

const sampleMapped = {
    ...sampleRaw,
    createdAt: new Date(sampleRaw.createdAt),
    updatedAt: new Date(sampleRaw.updatedAt),
};

describe("UserService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ----------------------------------------------------------------------
    // GET BY ID
    // ----------------------------------------------------------------------
    it("getById → returns mapped user", async () => {
        (http.get as any).mockResolvedValue({ data: sampleRaw });

        const result = await UserService.getById(1);

        expect(http.get).toHaveBeenCalledWith("/User/1");
        expect(result).toEqual(sampleMapped);
    });

    it("getById → throws on error", async () => {
        (http.get as any).mockRejectedValue(new Error("GET_ERROR"));
        await expect(UserService.getById(99)).rejects.toThrow("GET_ERROR");
    });

    // ----------------------------------------------------------------------
    // LIST
    // ----------------------------------------------------------------------
    it("list → maps page of users", async () => {
        (http.get as any).mockResolvedValue({
            data: { total: 1, items: [sampleRaw] },
        });

        const result = await UserService.list({ skip: 5, take: 20 });

        expect(http.get).toHaveBeenCalledWith("/User", {
            params: { skip: 5, take: 20 },
        });

        expect(result).toEqual({
            total: 1,
            items: [sampleMapped],
        });
    });

    it("list → uses defaults when no options provided", async () => {
        (http.get as any).mockResolvedValue({
            data: { total: 0, items: [] },
        });

        await UserService.list();

        expect(http.get).toHaveBeenCalledWith("/User", {
            params: { skip: 0, take: 50 },
        });
    });

    it("list → throws error", async () => {
        (http.get as any).mockRejectedValue(new Error("LIST_ERR"));
        await expect(UserService.list()).rejects.toThrow("LIST_ERR");
    });

    // ----------------------------------------------------------------------
    // EXISTS BY USERNAME
    // ----------------------------------------------------------------------
    it("existsByUsername → returns boolean", async () => {
        (http.get as any).mockResolvedValue({ data: { Exists: true } });

        const result = await UserService.existsByUsername("kevin");

        expect(http.get).toHaveBeenCalledWith("/User/exists/username", {
            params: { username: "kevin" },
        });

        expect(result).toBe(true);
    });

    it("existsByUsername → throws error", async () => {
        (http.get as any).mockRejectedValue(new Error("EXISTS_USER_ERR"));

        await expect(
            UserService.existsByUsername("kevin")
        ).rejects.toThrow("EXISTS_USER_ERR");
    });

    // ----------------------------------------------------------------------
    // EXISTS BY EMAIL
    // ----------------------------------------------------------------------
    it("existsByEmail → returns boolean", async () => {
        (http.get as any).mockResolvedValue({ data: { Exists: false } });

        const result = await UserService.existsByEmail("test@mail.com");

        expect(http.get).toHaveBeenCalledWith("/User/exists/email", {
            params: { email: "test@mail.com" },
        });

        expect(result).toBe(false);
    });

    it("existsByEmail → throws error", async () => {
        (http.get as any).mockRejectedValue(new Error("EXISTS_EMAIL_ERR"));

        await expect(
            UserService.existsByEmail("mail@mail.com")
        ).rejects.toThrow("EXISTS_EMAIL_ERR");
    });

    // ----------------------------------------------------------------------
    // CREATE
    // ----------------------------------------------------------------------
    it("create → posts payload and returns mapped user", async () => {
        (http.post as any).mockResolvedValue({ data: sampleRaw });

        const payload: CreateUserRequest = {
            username: "kevin",
            email: "kevin@mail.com",
            password: "secret",
            role: "ADMIN",
            isActive: true,
        };

        const result = await UserService.create(payload);

        expect(http.post).toHaveBeenCalledWith("/User", payload);

        expect(result).toEqual(sampleMapped);
    });

    it("create → throws error", async () => {
        (http.post as any).mockRejectedValue(new Error("CREATE_ERR"));

        await expect(
            UserService.create({
                username: "x",
                email: "x@mail.com",
                password: "123",
            })
        ).rejects.toThrow("CREATE_ERR");
    });

    // ----------------------------------------------------------------------
    // UPDATE
    // ----------------------------------------------------------------------
    it("update → patch and return mapped user", async () => {
        (http.patch as any).mockResolvedValue({ data: sampleRaw });

        const payload = { email: "new@mail.com" };

        const result = await UserService.update(1, payload);

        expect(http.patch).toHaveBeenCalledWith("/User/1", payload);
        expect(result).toEqual(sampleMapped);
    });

    it("update → throws error", async () => {
        (http.patch as any).mockRejectedValue(new Error("UPDATE_ERR"));

        await expect(
            UserService.update(5, { username: "new" })
        ).rejects.toThrow("UPDATE_ERR");
    });

    // ----------------------------------------------------------------------
    // DELETE
    // ----------------------------------------------------------------------
    it("remove → delete user", async () => {
        (http.delete as any).mockResolvedValue({ data: undefined });

        const result = await UserService.remove(9);

        expect(http.delete).toHaveBeenCalledWith("/User/9");
        expect(result).toBe(undefined);
    });

    it("remove → throws error", async () => {
        (http.delete as any).mockRejectedValue(new Error("DELETE_ERR"));

        await expect(UserService.remove(22)).rejects.toThrow("DELETE_ERR");
    });
});
