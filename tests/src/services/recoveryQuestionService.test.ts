import { describe, it, expect, vi, beforeEach } from "vitest";
import { RecoveryQuestionService } from "@/src/services/recoveryQuestionService";
import { http } from "@/src/lib";

vi.mock("@/src/lib", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("RecoveryQuestionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -----------------------------------------------------
  // getById
  // -----------------------------------------------------
  describe("getById", () => {
    it("should return a mapped recovery question", async () => {
      const mockData = { id: 10, question: "Your first pet?" };
      (http.get as any).mockResolvedValue({ data: mockData });

      const result = await RecoveryQuestionService.getById(10);

      expect((http.get as any)).toHaveBeenCalledWith("/RecoveryQuestion/10");
      expect(result).toEqual(mockData);
    });

    it("should throw if (http.get as any) fails", async () => {
      (http.get as any).mockRejectedValue(new Error("Network error"));

      await expect(RecoveryQuestionService.getById(1)).rejects.toThrow("Network error");
    });
  });

  // -----------------------------------------------------
  // list
  // -----------------------------------------------------
  describe("list", () => {
    it("should return mapped paginated data", async () => {
      const mockRaw = {
        total: 2,
        items: [
          { id: 1, question: "Q1" },
          { id: 2, question: "Q2" },
        ],
      };

      (http.get as any).mockResolvedValue({ data: mockRaw });

      const result = await RecoveryQuestionService.list({ skip: 0, take: 50 });

      expect((http.get as any)).toHaveBeenCalledWith("/RecoveryQuestion", {
        params: { skip: 0, take: 50 },
      });

      expect(result).toEqual({
        total: 2,
        items: mockRaw.items,
      });
    });

    it("should use default pagination if not provided", async () => {
      (http.get as any).mockResolvedValue({ data: { total: 0, items: [] } });

      await RecoveryQuestionService.list();

      expect((http.get as any)).toHaveBeenCalledWith("/RecoveryQuestion", {
        params: { skip: 0, take: 50 },
      });
    });

    it("should throw if list fails", async () => {
      (http.get as any).mockRejectedValue(new Error("Server down"));

      await expect(RecoveryQuestionService.list()).rejects.toThrow("Server down");
    });
  });

  // -----------------------------------------------------
  // create
  // -----------------------------------------------------
  describe("create", () => {
    it("should create and map recovery question", async () => {
      const payload = { question: "Your city?" };
      const mockResponse = { id: 123, question: "Your city?" };

      (http.post as any).mockResolvedValue({ data: mockResponse });

      const result = await RecoveryQuestionService.create(payload);

      expect((http.post as any)).toHaveBeenCalledWith("/RecoveryQuestion", payload);
      expect(result).toEqual(mockResponse);
    });

    it("should throw on creation failure", async () => {
      (http.post as any).mockRejectedValue(new Error("Validation error"));

      await expect(
        RecoveryQuestionService.create({ question: "Hi" })
      ).rejects.toThrow("Validation error");
    });
  });

  // -----------------------------------------------------
  // update
  // -----------------------------------------------------
  describe("update", () => {
    it("should update recovery question", async () => {
      const payload = { question: "Updated Q" };
      const mockResponse = { id: 55, question: "Updated Q" };

      (http.put as any).mockResolvedValue({ data: mockResponse });

      const result = await RecoveryQuestionService.update(55, payload);

      expect((http.put as any)).toHaveBeenCalledWith("/RecoveryQuestion/55", payload);
      expect(result).toEqual(mockResponse);
    });

    it("should throw on update failure", async () => {
      (http.put as any).mockRejectedValue(new Error("Update failed"));

      await expect(
        RecoveryQuestionService.update(1, { question: "X" })
      ).rejects.toThrow("Update failed");
    });
  });

  // -----------------------------------------------------
  // remove
  // -----------------------------------------------------
  describe("remove", () => {
    it("should delete recovery question", async () => {
      (http.delete as any).mockResolvedValue({ data: undefined });

      const result = await RecoveryQuestionService.remove(10);

      expect((http.delete as any)).toHaveBeenCalledWith("/RecoveryQuestion/10");
      expect(result).toBeUndefined();
    });

    it("should throw on delete failure", async () => {
      (http.delete as any).mockRejectedValue(new Error("Delete error"));

      await expect(RecoveryQuestionService.remove(10)).rejects.toThrow("Delete error");
    });
  });
});
