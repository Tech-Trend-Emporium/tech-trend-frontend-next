import { ApprovalJobType, Operation } from ".";


export type ApprovalJobResponseRaw = {
    id: number;
    type: ApprovalJobType;
    operation: Operation;
    state: boolean;          
    requestedBy: number;
    decidedBy?: number | null;
    requestedAt: string;     
    decidedAt?: string | null;
    targetId?: number | null;
    reason?: string | null;
};