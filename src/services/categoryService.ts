import { http } from "@/src/lib";
import type { ApprovalAcceptedResponseRaw, ApprovalJobResponse, ApprovalJobResponseRaw, CategoryResponse, CategoryResponseRaw, CreateCategoryRequest, CreateCategoryResult, DeleteCategoryResult, Page, UpdateCategoryRequest } from "@/src/models";


const BASE = "/Category";

const toDate = (iso?: string | null) => (iso ? new Date(iso) : null);
const mapCategory = (c: CategoryResponseRaw): CategoryResponse => ({
    ...c,
    createdAt: new Date(c.createdAt),
    updatedAt: toDate(c.updatedAt) ?? null,
});
const mapApprovalJob = (j: ApprovalJobResponseRaw): ApprovalJobResponse => ({
    ...j,
    requestedAt: new Date(j.requestedAt as unknown as string),
    decidedAt: j.decidedAt ? new Date(j.decidedAt as unknown as string) : null,
});

export const CategoryService = {
    getById: (id: number) => {
        return http.get<CategoryResponseRaw>(`${ BASE }/${ id }`).then(r => mapCategory(r.data));
    },

    list: (opts?: { skip?: number; take?: number }): Promise<Page<CategoryResponse>> => {
        return http.get<Page<CategoryResponseRaw>>(`${ BASE }`, {
                        params: { skip: opts?.skip ?? 0, take: opts?.take ?? 50 },
                    })
                    .then(r => ({
                        total: r.data.total,
                        items: r.data.items.map(mapCategory),
                    }));
    },

    create: async (payload: CreateCategoryRequest): Promise<CreateCategoryResult> => {
        const res = await http.post<CategoryResponseRaw | ApprovalAcceptedResponseRaw<ApprovalJobResponseRaw>>(
            `${ BASE }`,
            payload
        );

        if (res.status === 202) {
            const body = res.data as ApprovalAcceptedResponseRaw<ApprovalJobResponseRaw>;
            return {
                kind: "accepted",
                data: { message: body.message, approvalJob: mapApprovalJob(body.approvalJob) },
            };
        }

        return { kind: "created", data: mapCategory(res.data as CategoryResponseRaw) };
    },

    update: (id: number, payload: UpdateCategoryRequest) => {
        return http.put<CategoryResponseRaw>(`${ BASE }/${ id }`, payload).then(r => mapCategory(r.data));
    },

    remove: async (id: number): Promise<DeleteCategoryResult> => {
        const res = await http.delete<void | ApprovalAcceptedResponseRaw<ApprovalJobResponseRaw>>(`${ BASE }/${ id }`);

        if (res.status === 202) {
            const body = res.data as ApprovalAcceptedResponseRaw<ApprovalJobResponseRaw>;
            return {
                kind: "accepted",
                data: { message: body.message, approvalJob: mapApprovalJob(body.approvalJob) },
            };
        }

        return { kind: "no-content" };
    },
};