import type { ApprovalJobResponse } from "@/src/models";


export type DeleteCategoryResult =
    | { kind: "no-content" }                                        
    | { kind: "accepted"; data: { message: string; approvalJob: ApprovalJobResponse } }; 