import { http } from "../lib/http";
import type { CreateReviewRequest, Page, ReviewResponse, ReviewResponseRaw, UpdateReviewRequest } from "../models";


const BASE = "/Review";

const mapReview = (r: ReviewResponseRaw): ReviewResponse => ({ ...r });

export const ReviewService = {
    getById: (id: number) => {
        return http.get<ReviewResponseRaw>(`${ BASE }/${ id }`).then(r => mapReview(r.data));
    },

    list: (opts?: { skip?: number; take?: number }): Promise<Page<ReviewResponse>> => {
        return http.get<Page<ReviewResponseRaw>>(`${ BASE }`, {
                        params: { skip: opts?.skip ?? 0, take: opts?.take ?? 50 },
                    })
                    .then(r => ({
                        total: r.data.total,
                        items: r.data.items.map(mapReview),
                    }));
    },

    listByProduct: (productId: number, opts?: { skip?: number; take?: number }): Promise<Page<ReviewResponse>> => {
        return http.get<Page<ReviewResponseRaw>>(`${ BASE }/product/${ productId }`, {
                        params: { skip: opts?.skip ?? 0, take: opts?.take ?? 50 },
                    })
                    .then(r => ({
                        total: r.data.total,
                        items: r.data.items.map(mapReview),
                    }));
    },

    create: (payload: CreateReviewRequest) => {
        return http.post<ReviewResponseRaw>(`${ BASE }`, payload).then(r => mapReview(r.data));
    },

    update: (id: number, payload: UpdateReviewRequest) => {
        return http.patch<ReviewResponseRaw>(`${ BASE }/${ id }`, payload).then(r => mapReview(r.data));
    },

    remove: (id: number) => {
        return http.delete<void>(`${ BASE }/${ id }`).then(r => r.data);
    },
};