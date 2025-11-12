import { http } from "../lib/http";
import type { ApprovalJobResponse, ApprovalJobResponseRaw, DecideApprovalJobRequest, SubmitApprovalJobRequest } from "../models";


const BASE = "/ApprovalJob";

const mapApprovalJob = (j: ApprovalJobResponseRaw): ApprovalJobResponse => ({
    ...j,
    requestedAt: new Date(j.requestedAt),
    decidedAt: j.decidedAt ? new Date(j.decidedAt) : null,
});

export const ApprovalJobService = {
    submit: (payload: SubmitApprovalJobRequest) => {
        return http.post<ApprovalJobResponseRaw>(`${ BASE }`, payload).then(r => mapApprovalJob(r.data));
    },

    listPending: (params?: { skip?: number; take?: number }) => {
        return http.get<ApprovalJobResponseRaw[]>(`${ BASE }/pending`, {
                        params: { skip: params?.skip ?? 0, take: params?.take ?? 50 },
                    }).then(r => r.data.map(mapApprovalJob));
    },

    decide: (id: number, payload: DecideApprovalJobRequest) => {
        return http.post<ApprovalJobResponseRaw>(`${ BASE }/${ id }/decision`, payload).then(r => mapApprovalJob(r.data));
    },

    getById: (id: number) => {
        return http.get<ApprovalJobResponseRaw>(`${ BASE }/${ id }`).then(r => mapApprovalJob(r.data));
    },
};