import type { ApprovalJobResponse } from "@/src/models";


export type DeleteProductResult =
    | { kind: "no-content" } 
    | { kind: "accepted"; data: { message: string; approvalJob: ApprovalJobResponse } }; 