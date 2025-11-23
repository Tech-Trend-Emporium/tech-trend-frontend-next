import { http } from "@/src/lib";
import type { CouponResponse, CouponResponseRaw, CreateCouponRequest, Page, UpdateCouponRequest } from "@/src/models";


const BASE = "/Coupon";

const toDate = (iso?: string | null) => (iso ? new Date(iso) : null);
export const formatYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};
const mapCoupon = (c: CouponResponseRaw): CouponResponse => ({
    ...c,
    validFrom: new Date(c.validFrom),
    validTo: toDate(c.validTo) ?? null,
});

export const CouponService = {
    getById: (id: number) => {
        return http.get<CouponResponseRaw>(`${ BASE }/${ id }`).then(r => mapCoupon(r.data));
    },

    list: (opts?: { skip?: number; take?: number }): Promise<Page<CouponResponse>> => {
        return http.get<Page<CouponResponseRaw>>(`${ BASE }`, {
                        params: { skip: opts?.skip ?? 0, take: opts?.take ?? 50 },
                    })
                    .then(r => ({
                        total: r.data.total,
                        items: r.data.items.map(mapCoupon),
                    }));
    },

    create: (payload: CreateCouponRequest) => {
        return http.post<CouponResponseRaw>(`${ BASE }`, payload).then(r => mapCoupon(r.data));
    },

    update: (id: number, payload: UpdateCouponRequest) => {
        return http.patch<CouponResponseRaw>(`${ BASE }/${ id }`, payload).then(r => mapCoupon(r.data));
    },

    remove: (id: number) => {
        return http.delete<void>(`${ BASE }/${ id }`).then(r => r.data);
    },
};