"use client";

import { useEffect } from "react";
import { toastError } from "@/src/lib";


export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        toastError(error, "Something went wrong globally");
    }, [error]);

    return (
        <html>
            <body className="p-6">
                <h2 className="text-xl font-semibold mb-3">Something went wrong</h2>
                <button
                    onClick={() => reset()} 
                    className="px-3 py-2 rounded bg-blue-600 text-white"
                >
                    Retry
                </button>
            </body>
        </html>
    );
};