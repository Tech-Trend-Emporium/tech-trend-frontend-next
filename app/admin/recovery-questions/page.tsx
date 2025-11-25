"use client";

import { memo, useCallback, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { RecoveryQuestionService } from "@/src/services";
import type { RecoveryQuestionResponse } from "@/src/models";
import { toastSuccess, toastError } from "@/src/lib";
import { AdminListTemplate, ConfirmModal, Pagination, RecoveryQuestionsTable } from "@/src/components";
import { usePaginatedList } from "@/src/hooks";


const RecoveryQuestionsListPageInner = () => {
    const router = useRouter();

    const {
        items: questions,
        total,
        totalPages,
        page,
        setPage,
        loading,
        refresh,
        take,
    } = usePaginatedList<RecoveryQuestionResponse>(RecoveryQuestionService.list, 10);

    const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const onPageChange = useCallback((p: number) => setPage(p), [setPage]);

    const openDeleteModal = useCallback((id: number) => setDeleteModalId(id), []);
    const closeDeleteModal = useCallback(() => setDeleteModalId(null), []);

    const handleEdit = useCallback(
        (id: number) => router.push(`/admin/recovery-questions/edit/${id}`),
        [router]
    );
    const handleCreate = useCallback(
        () => router.push("/admin/recovery-questions/create"),
        [router]
    );

    const showPagination = useMemo(
        () => !loading && questions.length > 0 && totalPages > 1,
        [loading, questions.length, totalPages]
    );

    const handleDelete = useCallback(async () => {
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
    }, [deleteModalId, questions.length, total, page, take, setPage, refresh]);

    return (
        <>
            <AdminListTemplate
                title="Recovery Questions"
                entityName="Recovery Question"
                onCreateClick={handleCreate}
            >
                <RecoveryQuestionsTable
                    questions={questions}
                    isLoading={loading}
                    onEdit={handleEdit}
                    onDelete={openDeleteModal}
                />

                {showPagination && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            totalItems={total}
                            itemsPerPage={take}
                            onPageChange={onPageChange}
                        />
                    </div>
                )}
            </AdminListTemplate>

            <ConfirmModal
                isOpen={deleteModalId !== null}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this recovery question? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </>
    );
};

export default memo(RecoveryQuestionsListPageInner);