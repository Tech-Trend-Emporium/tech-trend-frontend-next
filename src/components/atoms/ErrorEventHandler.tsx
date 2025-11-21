"use client";

import { useEffect } from "react";
import { toastError } from "@/src/lib/toast";


export const ErrorEventHandler = () => {
    useEffect(() => {
        const onUnhandled = (e: PromiseRejectionEvent) => toastError(e.reason);
        const onError = (e: ErrorEvent) => toastError(e.error || e.message);

        window.addEventListener("unhandledrejection", onUnhandled);
        window.addEventListener("error", onError);
        
        return () => {
            window.removeEventListener("unhandledrejection", onUnhandled);
            window.removeEventListener("error", onError);
        };
    }, []);
    
    return null;
};