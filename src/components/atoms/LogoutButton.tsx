"use client";

import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../auth";
import { clearAuth } from "@/src/utils";


export const LogoutButton = () => {
    const router = useRouter();
    const { signOut } = useAuth();

    const handleLogout = async () => {
        try {
            // end all sessions on the server; this also clears local auth and flips context state
            await signOut({ allSessions: true });
            // ^ AuthProvider does: clearAuth(); setAuthState({ isAuthenticated: false }). Triggers rerender for all subscribers
        } finally {
            clearAuth();
            router.push("/");
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            <Button
                className="h-9 w-16 bg-linear-to-r from-red-600 via-red-700 to-red-900 text-white hover:bg-linear-to-br focus:ring-red-300 dark:focus:ring-red-800 hover:cursor-pointer dark:text-white"
                onClick={handleLogout}
            >
                Logout
            </Button>
        </div>
    );
};