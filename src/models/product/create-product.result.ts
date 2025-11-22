import type { ApprovalJobResponse, ProductResponse } from "@/src/models";


export type CreateProductResult =
    | { kind: "created"; data: ProductResponse } 
    | { kind: "accepted"; data: { message: string; approvalJob: ApprovalJobResponse } }; 