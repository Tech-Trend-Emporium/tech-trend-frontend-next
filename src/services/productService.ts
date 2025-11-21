/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "../lib/http";
import type { ApprovalJobResponse, ApprovalJobResponseRaw, CreateProductRequest, CreateProductResult, DeleteProductResult, Page, ProductResponse, ProductResponseRaw, UpdateProductRequest } from "../models";


const BASE = "/Product";

const toDate = (iso?: string | null) => (iso ? new Date(iso) : null);
const mapProduct = (p: ProductResponseRaw): ProductResponse => ({
    ...p,
    createdAt: new Date(p.createdAt),
    updatedAt: toDate(p.updatedAt) ?? null,
});
const mapApprovalJob = (j: ApprovalJobResponseRaw): ApprovalJobResponse => ({
    ...j,
    requestedAt: new Date((j as any).requestedAt),
    decidedAt: (j as any).decidedAt ? new Date((j as any).decidedAt) : null,
});

export const ProductService = {
    getById: (id: number) => {
        return http.get<ProductResponseRaw>(`${BASE}/${id}`).then(r => mapProduct(r.data));
    },

    getByName: (name: string) => {
        return http.get<ProductResponseRaw>(`${BASE}/${name}`).then(r => mapProduct(r.data));
    },

    list: (opts?: { skip?: number; take?: number; category?: string | null }): Promise<Page<ProductResponse>> => {
        return http.get<Page<ProductResponseRaw>>(`${BASE}`, {
                        params: {
                            skip: opts?.skip ?? 0,
                            take: opts?.take ?? 50,
                            category: opts?.category ?? undefined,
                        },
                    })
                    .then(r => ({
                        total: r.data.total,
                        items: r.data.items.map(mapProduct),
                    }));
    },

    create: async (payload: CreateProductRequest): Promise<CreateProductResult> => {
        const res = await http.post<ProductResponseRaw | { message: string; approvalJob: ApprovalJobResponseRaw }>(
            `${BASE}`,
            payload
        );

        if (res.status === 202) {
            const body = res.data as { message: string; approvalJob: ApprovalJobResponseRaw };
            return { kind: "accepted", data: { message: body.message, approvalJob: mapApprovalJob(body.approvalJob) } };
        }

        return { kind: "created", data: mapProduct(res.data as ProductResponseRaw) };
    },

    update: (id: number, payload: UpdateProductRequest) => {
        return http.patch<ProductResponseRaw>(`${BASE}/${id}`, payload).then(r => mapProduct(r.data));
    },

    remove: async (id: number): Promise<DeleteProductResult> => {
        const res = await http.delete<void | { message: string; approvalJob: ApprovalJobResponseRaw }>(`${BASE}/${id}`);

        if (res.status === 202) {
            const body = res.data as { message: string; approvalJob: ApprovalJobResponseRaw };
            return { kind: "accepted", data: { message: body.message, approvalJob: mapApprovalJob(body.approvalJob) } };
        }

        return { kind: "no-content" };
    },
};