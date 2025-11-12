"use client";

import axios from "axios"; 
import { clearAuth, getAuth, setAuth } from "../utils";


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const http = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
    const auth = getAuth();

    if (auth?.accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${ auth.accessToken }`;
    }
    
    return config;
});

let isRefreshing = false;
let queue: Array<() => void> = [];

const flushQueue = () => {
    queue.forEach((resolve) => resolve());
    queue = [];
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

                const { data } = await http.post(`${ BASE_URL }/Auth/refresh`, { refreshToken });
                setAuth(data);
                flushQueue();

                return http(original);
            } catch {
                clearAuth();
                
                throw error;
            } finally {
                isRefreshing = false;
            }
        }

        throw error;
    }
);