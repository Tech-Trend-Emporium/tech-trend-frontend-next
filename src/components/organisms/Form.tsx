import { Button } from "../atoms";
import type { ReactNode } from "react";


interface FormProps {
    children: ReactNode;
    onSubmit: (e: React.FormEvent) => void;
    submitButton: {
        text: string;
        disabled?: boolean;
        isLoading?: boolean;
        variant?: "primary" | "secondary" | "outline" | "danger" | "dark";
    };
    errorMessage?: string | null;
    className?: string;
}

export const Form = ({
    children,
    onSubmit,
    submitButton,
    errorMessage,
    className = "",
}: FormProps) => (
    <form onSubmit={onSubmit} className={className}>
        {children}

        <Button
            type="submit"
            variant={submitButton.variant || "dark"}
            fullWidth
            disabled={submitButton.disabled}
            isLoading={submitButton.isLoading}
            className="font-semibold cursor-pointer"
        >
            {submitButton.text}
        </Button>

        {errorMessage && (
            <div className="mt-3 text-center text-red-600 dark:text-red-400 text-sm font-medium">
                {errorMessage}
            </div>
        )}
    </form>
);