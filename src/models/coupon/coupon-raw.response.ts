export interface CouponResponseRaw {
    id: number;
    code: string;
    discount: number;
    active: boolean;
    validFrom: string;        
    validTo?: string | null;  
}