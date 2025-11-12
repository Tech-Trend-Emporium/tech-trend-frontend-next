import { http } from "../lib/http";
import type { CreateUserRequest, Page, UpdateUserRequest, UserResponse, UserResponseRaw } from "../models";


const BASE = "/User";

const toDate = (iso?: string | null) => (iso ? new Date(iso) : null);
const mapUser = (u: UserResponseRaw): UserResponse => ({
    ...u,
    createdAt: new Date(u.createdAt),
    updatedAt: toDate(u.updatedAt) ?? null,
});

export const UserService = {
    getById: (id: number) => {
        return http.get<UserResponseRaw>(`${ BASE }/${ id }`).then(r => mapUser(r.data));
    },

    list: (opts?: { skip?: number; take?: number }): Promise<Page<UserResponse>> => {
        return http.get<Page<UserResponseRaw>>(`${ BASE }`, {
                        params: { skip: opts?.skip ?? 0, take: opts?.take ?? 50 },
                    })
                    .then(r => ({
                        total: r.data.total,
                        items: r.data.items.map(mapUser),
                    }));
    },

    existsByUsername: (username: string): Promise<boolean> => {
        return http.get<{ Exists: boolean }>(`${ BASE }/exists/username`, { params: { username } })
                    .then(r => r.data.Exists);
    },

    existsByEmail: (email: string): Promise<boolean> => {
        return http.get<{ Exists: boolean }>(`${ BASE }/exists/email`, { params: { email } })
                    .then(r => r.data.Exists);
    },
    
    create: (payload: CreateUserRequest) => {
        return http.post<UserResponseRaw>(`${ BASE }`, payload).then(r => mapUser(r.data));
    },

    update: (id: number, payload: UpdateUserRequest) => {
        return http.patch<UserResponseRaw>(`${ BASE }/${ id }`, payload).then(r => mapUser(r.data));
    },

    remove: (id: number) => {
        return http.delete<void>(`${ BASE }/${ id }`).then(r => r.data);
    },
};