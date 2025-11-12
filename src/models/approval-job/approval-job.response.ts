import type { ApprovalJobResponseRaw } from ".";


export type ApprovalJobResponse = Omit<ApprovalJobResponseRaw, "requestedAt" | "decidedAt"> & {
    requestedAt: Date;
    decidedAt?: Date | null;
};