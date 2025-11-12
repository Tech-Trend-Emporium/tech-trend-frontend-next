export type ApprovalJobResponseRaw = {
    id: number;
    type: string;
    operation: string;
    state: boolean;          
    requestedBy: number;
    decidedBy?: number | null;
    requestedAt: string;     
    decidedAt?: string | null;
    targetId?: number | null;
    reason?: string | null;
};