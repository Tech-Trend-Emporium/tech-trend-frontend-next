"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CategoryService } from "@/src/services";
import type { CategoryResponse, DeleteCategoryResult } from "@/src/models";
import { toastSuccess, toastError } from "@/src/lib";
import { AdminListTemplate, CategoriesTable, ConfirmModal, Pagination } from "@/src/components";
import { usePaginatedList } from "@/src/hooks";
import { useAuth } from "@/src/auth";


const CategoriesListPageInner = () => {
    const router = useRouter();
    const { auth } = useAuth();

    const {
        items: categories,
        total,
        totalPages,
        page,
        setPage,
        loading,
        refresh,
        take,
    } = usePaginatedList<CategoryResponse>(CategoryService.list, 10);

    const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const mountedRef = useRef(true);
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const closeModal = useCallback(() => setDeleteModalId(null), []);

    const handleCreate = useCallback(
        () => router.push("/admin/categories/create"),
        [router]
    );

    const handleEdit = useCallback(
        (id: number) => router.push(`/admin/categories/edit/${id}`),
        [router]
    );

    const requestRefreshKeepingPage = useCallback(
        (p: number) => {
            void refresh(p);
        },
        [refresh]
    );

    const handleDelete = useCallback(async () => {
        if (!deleteModalId || isDeleting) return;

        setIsDeleting(true);
        try {
            const result: DeleteCategoryResult = await CategoryService.remove(deleteModalId);

            if (result.kind === "accepted") {
                toastSuccess(result.data.message || "Category deletion pending approval");
                requestRefreshKeepingPage(page);
            } else {
                toastSuccess("Category deleted successfully");

                const newTotal = total - 1;
                const isLastItemOnPage = categories.length === 1;
                const maxIndexOnCurrentPage = (page - 1) * take;

                const nextPage =
                    isLastItemOnPage && page > 1 && newTotal <= maxIndexOnCurrentPage
                        ? page - 1
                        : page;

                if (nextPage !== page) {
                    setPage(nextPage);
                } else {
                    requestRefreshKeepingPage(page);
                }
            }
        } catch (error) {
            const msg = axios.isAxiosError(error)
                ? error.response?.data?.message || "Failed to delete category"
                : "Unexpected error occurred";
            toastError(msg);
        } finally {
            if (!mountedRef.current) return;
            setIsDeleting(false);
            closeModal();
        }
    }, [
        deleteModalId,
        isDeleting,
        categories.length,
        page,
        take,
        total,
        requestRefreshKeepingPage,
        setPage,
        closeModal,
    ]);

    const onDeleteAsk = useCallback((id: number) => setDeleteModalId(id), []);
    const canShowPagination = useMemo(
        () => !loading && categories.length > 0,
        [loading, categories.length]
    );

    return (
        <>
            <AdminListTemplate title="Categories" entityName="Category" onCreateClick={handleCreate}>
                <CategoriesTable
                    categories={categories}
                    isLoading={loading}
                    onEdit={handleEdit}
                    onDelete={onDeleteAsk}
                    isAdmin={auth.isAuthenticated && auth?.role === "ADMIN"}
                />

                {canShowPagination && (
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
                onClose={closeModal}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this category? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </>
    );
};

export default memo(CategoriesListPageInner);