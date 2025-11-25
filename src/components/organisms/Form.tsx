import { memo } from "react";
import { Button } from "@/src/components";
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

const FormInner = ({
    children,
    onSubmit,
    submitButton,
    errorMessage,
    className = "",
}: FormProps) => {
    return (
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
};

const areEqual = (prev: Readonly<FormProps>, next: Readonly<FormProps>) => {
    const sbPrev = prev.submitButton;
    const sbNext = next.submitButton;
    const sameButton =
        sbPrev.text === sbNext.text &&
        sbPrev.disabled === sbNext.disabled &&
        sbPrev.isLoading === sbNext.isLoading &&
        (sbPrev.variant || "dark") === (sbNext.variant || "dark");

    return (
        prev.onSubmit === next.onSubmit &&
        prev.children === next.children &&
        sameButton &&
        prev.errorMessage === next.errorMessage &&
        prev.className === next.className
    );
};

export const Form = memo(FormInner, areEqual);