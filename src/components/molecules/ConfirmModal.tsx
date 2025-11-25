import { memo } from "react";
import { Button } from "@/src/components";


interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

const ConfirmModalInner = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isLoading = false,
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const areEqual = (prev: Readonly<ConfirmModalProps>, next: Readonly<ConfirmModalProps>) => {
    return (
        prev.isOpen === next.isOpen &&
        prev.isLoading === next.isLoading &&
        prev.title === next.title &&
        prev.message === next.message &&
        prev.confirmText === next.confirmText &&
        prev.cancelText === next.cancelText &&
        prev.onClose === next.onClose &&
        prev.onConfirm === next.onConfirm
    );
};

export const ConfirmModal = memo(ConfirmModalInner, areEqual);