"use client";

import axios from "axios";
import { clearAuth, getAuth, setAuth } from "../utils";
import { toastError } from "./toast";


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const http = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

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
    async (error) => {
        const original = error.config;

        if (error?.response?.status === 401 && !original._retry) {
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
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...data, isAuthenticated: true }),
                    });
                } catch { }

                flushQueue();
                return http(original);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                clearAuth();
                throw error;
            } finally {
                isRefreshing = false;
            }
        }

        const status = error?.response?.status;
        const key = `${error?.config?.url ?? ""}::${status}`;
        const isRefresh = original?._retry === true || original?.url?.includes("/Auth/refresh");

        if (!isRefresh && !dedupe(key)) {
            if (status === 400) toastError(error, "Invalid request");
            else if (status === 401) toastError(error, "Unauthorized");
            else if (status === 403) toastError(error, "Access denied");
            else if (status === 404) toastError(error, "Resource not found");
            else if (status >= 500) toastError(error, "Server error");
            else toastError(error);
        }

        throw error;
    }
);