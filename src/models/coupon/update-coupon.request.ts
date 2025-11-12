export interface UpdateCouponRequest {
    discount?: number | null;
    active?: boolean | null;
    validFrom?: string | null;  
    validTo?: string | null;    
}