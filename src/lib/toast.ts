/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { toast } from "react-toastify";


export const toastError = (err: unknown, fallback = "Something went wrong") => {
    const msg = typeof err === "string"
                    ? err
                    : (err as any)?.message ||
                        (err as any)?.response?.data?.message ||
                        (err as any)?.response?.data?.error ||
                        fallback;
    
    toast.error(msg);
};

export const toastSuccess = (msg: string) => toast.success(msg);
export const toastInfo = (msg: string) => toast.info(msg);
export const toastWarn = (msg: string) => toast.warn(msg);