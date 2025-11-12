import type { ApprovalJobResponse, ProductResponse } from "../";


export type CreateProductResult =
    | { kind: "created"; data: ProductResponse } 
    | { kind: "accepted"; data: { message: string; approvalJob: ApprovalJobResponse } }; 