"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RecoveryQuestionService } from "@/src/services";
import type { RecoveryQuestionResponse } from "@/src/models";
import { toastSuccess, toastError } from "@/src/lib/toast";
import { AdminListTemplate, ConfirmModal, Pagination } from "@/src/components";
import { usePaginatedList } from "@/src/hooks/usePaginatedList";
import { RecoveryQuestionsTable } from "@/src/components/organisms/RecoveryQuestionsTable";


export default function RecoveryQuestionsListPage() {
    const router = useRouter();

    const { items: questions, total, totalPages, page, setPage, loading, refresh, take } = 
        usePaginatedList<RecoveryQuestionResponse>(RecoveryQuestionService.list, 10);

    const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteModalId) return;
        setIsDeleting(true);
        try {
            await RecoveryQuestionService.remove(deleteModalId);
            toastSuccess("Recovery question deleted successfully");

            const isLastItemOnPage = questions.length === 1;
            const newTotal = total - 1;
            const maxIndexOnCurrentPage = (page - 1) * take;

            if (isLastItemOnPage && page > 1 && newTotal <= maxIndexOnCurrentPage) {
                setPage(page - 1);
            } else {
                refresh(page);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toastError(error.response?.data?.message || "Failed to delete recovery question");
            } else {
                toastError("Unexpected error occurred");
            }
        } finally {
            setIsDeleting(false);
            setDeleteModalId(null);
        }
    };

    const handleEdit = (id: number) => router.push(`/admin/recovery-questions/edit/${id}`);
    const handleCreate = () => router.push("/admin/recovery-questions/create");

    return (
        <>
            <AdminListTemplate title="Recovery Questions" entityName="Recovery Question" onCreateClick={handleCreate}>
                <RecoveryQuestionsTable
                    questions={questions}
                    isLoading={loading}
                    onEdit={handleEdit}
                    onDelete={(id) => setDeleteModalId(id)}
                />

                {!loading && questions.length > 0 && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            totalItems={total}
                            itemsPerPage={take}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </AdminListTemplate>

            <ConfirmModal
                isOpen={deleteModalId !== null}
                onClose={() => setDeleteModalId(null)}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this recovery question? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </>
    );
}