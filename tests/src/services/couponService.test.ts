import { describe, it, expect, vi, beforeEach } from "vitest";
import { CouponService, formatYMD } from "@/src/services/couponService";
import { http } from "@/src/lib";

vi.mock("@/src/lib", () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("CouponService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const rawCoupon = {
        id: 1,
        code: "WELCOME",
        discount: 10,
        active: true,
        validFrom: "2024-01-01",
        validTo: "2024-12-31",
    };

    // ---------------------------------------------------
    // getById
    // ---------------------------------------------------
    describe("getById", () => {
        it("should return mapped coupon", async () => {
            (http.get as any).mockResolvedValue({ data: rawCoupon });

            const result = await CouponService.getById(1);

            expect(result).toEqual({
                ...rawCoupon,
                validFrom: new Date(rawCoupon.validFrom),
                validTo: new Date(rawCoupon.validTo)
            });
            expect(((http.get as any) as any)).toHaveBeenCalledWith("/Coupon/1");
        });

        it("should throw on http error", async () => {
            (http.get as any).mockRejectedValue(new Error("network error"));
            await expect(CouponService.getById(1)).rejects.toThrow("network error");
        });
    });

    // ---------------------------------------------------
    // list
    // ---------------------------------------------------
    describe("list", () => {
        const rawPage = {
            total: 1,
            items: [rawCoupon],
        };

        it("should return mapped page", async () => {
            (http.get as any).mockResolvedValue({ data: rawPage });

            const result = await CouponService.list({ skip: 0, take: 10 });

            expect(result.total).toBe(1);
            expect(result.items[0]).toEqual({
                ...rawCoupon,
                validFrom: new Date(rawCoupon.validFrom),
                validTo: new Date(rawCoupon.validTo)
            });

            expect((http.get as any)).toHaveBeenCalledWith("/Coupon", {
                params: { skip: 0, take: 10 },
            });
        });

        it("should throw on http error", async () => {
            (http.get as any).mockRejectedValue(new Error("fail"));

            await expect(CouponService.list()).rejects.toThrow("fail");
        });
    });

    // ---------------------------------------------------
    // create
    // ---------------------------------------------------
    describe("create", () => {
        it("should create coupon and map response", async () => {
            (http.post as any).mockResolvedValue({ data: rawCoupon });

            const payload = {
                discount: 10,
                validFrom: "2024-01-01",
                validTo: "2024-12-31",
            };

            const result = await CouponService.create(payload);

            expect(result).toEqual({
                ...rawCoupon,
                validFrom: new Date(rawCoupon.validFrom),
                validTo: new Date(rawCoupon.validTo),
            });

            expect((http.post as any)).toHaveBeenCalledWith("/Coupon", payload);
        });

        it("should throw on error", async () => {
            (http.post as any).mockRejectedValue(new Error("create error"));

            await expect(
                CouponService.create({ discount: 10, validFrom: "2024-01-01" })
            ).rejects.toThrow("create error");
        });
    });

    // ---------------------------------------------------
    // update
    // ---------------------------------------------------
    describe("update", () => {
        it("should update coupon", async () => {
            (http.patch as any).mockResolvedValue({ data: rawCoupon });

            const payload = { discount: 15 };

            const result = await CouponService.update(1, payload);

            expect(result.validFrom).toBeInstanceOf(Date);
            expect((http.patch as any)).toHaveBeenCalledWith("/Coupon/1", payload);
        });

        it("should throw on update error", async () => {
            (http.patch as any).mockRejectedValue(new Error("update error"));

            await expect(CouponService.update(1, {})).rejects.toThrow("update error");
        });
    });

    // ---------------------------------------------------
    // remove
    // ---------------------------------------------------
    describe("remove", () => {
        it("should remove coupon and return void", async () => {
            (http.delete as any).mockResolvedValue({ data: undefined });

            const result = await CouponService.remove(1);

            expect(result).toBeUndefined();
            expect((http.delete as any)).toHaveBeenCalledWith("/Coupon/1");
        });

        it("should throw on delete error", async () => {
            (http.delete as any).mockRejectedValue(new Error("delete failed"));

            await expect(CouponService.remove(1)).rejects.toThrow("delete failed");
        });
    });

});
