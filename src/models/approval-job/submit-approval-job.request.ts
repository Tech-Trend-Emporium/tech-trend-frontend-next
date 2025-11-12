import type { ApprovalJobType, Operation } from ".";


export interface SubmitApprovalJobRequest {
    type: ApprovalJobType;
    operation: Operation;
    targetId?: number | null;
    payload?: unknown;
    reason?: string | null;
};