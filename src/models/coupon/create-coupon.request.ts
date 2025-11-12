export interface CreateCouponRequest {
    discount: number;      
    active?: boolean;      
    validFrom: string;     
    validTo?: string | null; 
}