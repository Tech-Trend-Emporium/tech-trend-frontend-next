import type { ApprovalJobResponse } from "../";


export type DeleteProductResult =
    | { kind: "no-content" } 
    | { kind: "accepted"; data: { message: string; approvalJob: ApprovalJobResponse } }; 