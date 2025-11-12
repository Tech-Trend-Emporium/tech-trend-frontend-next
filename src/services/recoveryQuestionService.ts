import { http } from "../lib/http";
import type { CreateRecoveryQuestionRequest, Page, RecoveryQuestionResponse, RecoveryQuestionResponseRaw, UpdateRecoveryQuestionRequest } from "../models";


const BASE = "/RecoveryQuestion";

const mapRQ = (x: RecoveryQuestionResponseRaw): RecoveryQuestionResponse => ({ ...x });

export const RecoveryQuestionService = {
    getById: (id: number) => {
        return http.get<RecoveryQuestionResponseRaw>(`${ BASE }/${ id }`).then(r => mapRQ(r.data));
    },

    list: (opts?: { skip?: number; take?: number }): Promise<Page<RecoveryQuestionResponse>> => {
        return http.get<Page<RecoveryQuestionResponseRaw>>(`${ BASE }`, {
                        params: { skip: opts?.skip ?? 0, take: opts?.take ?? 50 },
                    })
                    .then(r => ({
                        total: r.data.total,
                        items: r.data.items.map(mapRQ),
                    }));
    },

    create: (payload: CreateRecoveryQuestionRequest) => {
        return http.post<RecoveryQuestionResponseRaw>(`${ BASE }`, payload).then(r => mapRQ(r.data));
    },

    update: (id: number, payload: UpdateRecoveryQuestionRequest) => {
        return http.put<RecoveryQuestionResponseRaw>(`${ BASE }/${ id }`, payload).then(r => mapRQ(r.data));
    },

    remove: (id: number) => {
        return http.delete<void>(`${ BASE }/${ id }`).then(r => r.data);
    },
};