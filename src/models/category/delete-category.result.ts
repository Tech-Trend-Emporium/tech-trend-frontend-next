import type { ApprovalJobResponse } from "../";


export type DeleteCategoryResult =
    | { kind: "no-content" }                                        
    | { kind: "accepted"; data: { message: string; approvalJob: ApprovalJobResponse } }; 