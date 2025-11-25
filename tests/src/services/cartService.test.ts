import { describe, it, expect, vi, beforeEach } from "vitest";
import { CartService } from "@/src/services/cartService";
import { http } from "@/src/lib";
import { AxiosError } from "axios";

vi.mock("@/src/lib", () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

const rawCart = {
    id: 1,
    userId: 10,
    subtotal: 100,
    discount: 10,
    discountAmount: 10,
    total: 90,
    couponCode: "SAVE10",
    items: [],
    createdAt: "2025-01-01T00:00:00.000Z",
};

const rawOrder = {
    id: 1,
    userId: 10,
    items: [],
    placedAtUtc: "2025-01-01T00:00:00.000Z",
    paidAtUtc: null,
};

describe("CartService (Vitest)", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ------------------------------------------------------------
    // GET CART
    // ------------------------------------------------------------
    describe("get()", () => {
        it("returns a mapped cart (success)", async () => {
            (http.get as any).mockResolvedValue({ data: rawCart });

            const result = await CartService.get();

            expect(result.id).toBe(1);
            expect(result.createdAt instanceof Date).toBe(true);
        });

        it("throws if http.get rejects", async () => {
            (http.get as any).mockRejectedValue(new Error("Network Error"));

            await expect(CartService.get()).rejects.toThrow("Network Error");
        });

    });

    // ------------------------------------------------------------
    // ADD ITEM
    // ------------------------------------------------------------
    describe("addItem()", () => {
        const payload = { productId: 1, quantity: 2 };

        it("returns mapped cart (success)", async () => {
            (http.post as any).mockResolvedValue({ data: rawCart });

            const result = await CartService.addItem(payload);

            expect(result.createdAt instanceof Date).toBe(true);
        });

        it("throws if http.post fails", async () => {
            const err = new AxiosError('Bad request', '400');
            (http.post as any).mockRejectedValue(err);

            await expect(CartService.addItem(payload)).rejects.toThrow(err);
        });
    });

    // ------------------------------------------------------------
    // UPDATE QUANTITY
    // ------------------------------------------------------------
    describe("updateQuantity()", () => {
        const payload = { productId: 1, quantity: 5 };

        it("returns mapped cart (success)", async () => {
            (http.put as any).mockResolvedValue({ data: rawCart });

            const result = await CartService.updateQuantity(payload);

            expect(result.id).toBe(1);
        });

        it("throws if http.put rejects", async () => {
            const err = new AxiosError('Bad request', '400');
            (http.put as any).mockRejectedValue(err);

            await expect(CartService.updateQuantity(payload)).rejects.toThrow(err);
        });
    });

    // ------------------------------------------------------------
    // REMOVE ITEM
    // ------------------------------------------------------------
    describe("removeItem()", () => {
        it("returns mapped cart (success)", async () => {
            (http.delete as any).mockResolvedValue({ data: rawCart });

            const result = await CartService.removeItem(1);

            expect(result.items).toEqual([]);
        });

        it("throws if http.delete fails", async () => {
            const err = new AxiosError('Not found', '404');
            (http.delete as any).mockRejectedValue(err);

            await expect(CartService.removeItem(1)).rejects.toThrow(err);
        });

    });

    // ------------------------------------------------------------
    // CLEAR CART
    // ------------------------------------------------------------
    describe("clear()", () => {
        it("returns mapped cart (success)", async () => {
            (http.post as any).mockResolvedValue({ data: rawCart });

            const result = await CartService.clear();

            expect(result.id).toBe(1);
        });

        it("throws if http.post fails", async () => {
            (http.post as any).mockRejectedValue(new Error("Clear error"));

            await expect(CartService.clear()).rejects.toThrow("Clear error");
        });

    });

    // ------------------------------------------------------------
    // APPLY COUPON
    // ------------------------------------------------------------
    describe("applyCoupon()", () => {
        const payload = { couponCode: "SAVE10" };

        it("returns mapped cart (success)", async () => {
            (http.post as any).mockResolvedValue({ data: rawCart });

            const result = await CartService.applyCoupon(payload);

            expect(result.couponCode).toBe("SAVE10");
        });

        it("throws if http.post fails", async () => {
            const err = new AxiosError('Bad request', '400');
            (http.post as any).mockRejectedValue(err);

            await expect(CartService.applyCoupon(payload)).rejects.toThrow(err);
        });

    });

    // ------------------------------------------------------------
    // REMOVE COUPON
    // ------------------------------------------------------------
    describe("removeCoupon()", () => {
        it("returns mapped cart (success)", async () => {
            const noCoupon = { ...rawCart, couponCode: null };
            (http.delete as any).mockResolvedValue({ data: noCoupon });

            const result = await CartService.removeCoupon();

            expect(result.couponCode).toBe(null);
        });

        it("throws if http.delete fails", async () => {
            const err = new AxiosError('Not found', '404');
            (http.delete as any).mockRejectedValue(err);

            await expect(CartService.removeCoupon()).rejects.toThrow(err);
        });

    });

    // ------------------------------------------------------------
    // CHECKOUT
    // ------------------------------------------------------------
    describe("checkout()", () => {
        const payload = { address: "Street 1", paymentMethod: "CREDIT_CARD" as const };

        it("returns void (success)", async () => {
            (http.post as any).mockResolvedValue({ data: undefined });

            const result = await CartService.checkout(payload);

            expect(result).toBeUndefined();
        });

        it("throws if http.post fails", async () => {
            const err = new AxiosError('Bad request', '400');
            (http.post as any).mockRejectedValue(err);

            await expect(CartService.checkout(payload)).rejects.toThrow(err);
        });

        
    });

    // ------------------------------------------------------------
    // LIST MY ORDERS
    // ------------------------------------------------------------
    describe("listMyOrders()", () => {
        const rawPage = {
            total: 1,
            items: [rawOrder],
        };

        it("returns mapped orders (success)", async () => {
            (http.get as any).mockResolvedValue({ data: rawPage });

            const result = await CartService.listMyOrders();

            expect(result.total).toBe(1);
            expect(result.items[0].placedAtUtc instanceof Date).toBe(true);
        });
    });
});
