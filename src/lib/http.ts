/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios, { AxiosError } from "axios";
import { clearAuth, getAuth, setAuth } from "@/src/utils";
import { toastError } from "@/src/lib";


declare module "axios" {
    export interface InternalAxiosRequestConfig<D = any> {
        _retry?: boolean;
    }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const http = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

const g = globalThis as any;
if (!g.__HTTP_INTERCEPTORS_WIRED__) {
    g.__HTTP_INTERCEPTORS_WIRED__ = true;

    http.interceptors.request.use((config) => {
        const auth = getAuth();
        if (auth?.accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${auth.accessToken}`;
        }
        return config;
    });

    let isRefreshing = false;
    let queue: Array<() => void> = [];
    const flushQueue = () => {
        queue.forEach((resolve) => resolve());
        queue = [];
    };

    const recent = new Set<string>();
    const dedupe = (key: string) => {
        if (recent.has(key)) return true;
        recent.add(key);
        setTimeout(() => recent.delete(key), 1500);
        return false;
    };

    http.interceptors.response.use(
        (res) => res,
        async (error: AxiosError) => {
            const original = error.config;

            const status = error?.response?.status;
            const url = String(original?.url || "");

            const isRefreshEndpoint = url.includes("/Auth/refresh");
            const isSessionEndpoint = url.includes("/api/session");

            if (status === 401 && original && !original._retry && !isRefreshEndpoint) {
                if (isRefreshing) {
                    await new Promise<void>((resolve) => queue.push(resolve));
                    return http(original);
                }

                isRefreshing = true;
                original._retry = true;

                try {
                    const auth = getAuth();
                    const refreshToken = auth?.refreshToken;
                    if (!refreshToken) throw new Error("No refresh token");

                    const { data } = await http.post(`/Auth/refresh`, { refreshToken });

                    setAuth(data);

                    try {
                        await fetch("/api/session", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
                            body: JSON.stringify({ ...data, isAuthenticated: true }),
                            credentials: "same-origin",
                            cache: "no-store",
                            keepalive: true,
                        });
                    } catch { }

                    flushQueue();
                    return http(original);
                } catch (e) {
                    try {
                        await fetch("/api/session", { method: "DELETE", credentials: "same-origin", keepalive: true });
                    } catch { }
                    clearAuth();
                    throw error;
                } finally {
                    isRefreshing = false;
                }
            }

            const isRefreshFlow = original?._retry === true || isRefreshEndpoint || isSessionEndpoint;
            const key = `${url}::${status}`;
            if (!isRefreshFlow && !dedupe(key)) {
                if (status === 400) toastError(error, "Invalid request");
                else if (status === 401) toastError(error, "Unauthorized");
                else if (status === 403) toastError(error, "Access denied");
                else if (status === 404) toastError(error, "Resource not found");
                else if (status && status >= 500) toastError(error, "Server error");
                else toastError(error);
            }

            throw error;
        }
    );
}