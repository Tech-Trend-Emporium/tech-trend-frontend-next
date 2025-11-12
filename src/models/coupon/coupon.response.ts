import type { CouponResponseRaw } from ".";


export type CouponResponse = Omit<CouponResponseRaw, "validFrom" | "validTo"> & {
    validFrom: Date;
    validTo?: Date | null;
};