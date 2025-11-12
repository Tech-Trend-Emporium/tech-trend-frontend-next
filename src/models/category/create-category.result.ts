import type { CategoryResponse, ApprovalJobResponse } from "../";


export type CreateCategoryResult =
    | { kind: "created"; data: CategoryResponse }                        
    | { kind: "accepted"; data: { message: string; approvalJob: ApprovalJobResponse } };