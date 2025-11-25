"use client";

import { memo, useCallback, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserService } from "@/src/services";
import type { UserResponse } from "@/src/models";
import { toastSuccess, toastError } from "@/src/lib";
import { AdminListTemplate, ConfirmModal, Pagination, UsersTable } from "@/src/components";
import { usePaginatedList } from "@/src/hooks";


const UsersListPageInner = () => {
    const router = useRouter();

    const {
        items: users,
        total,
        totalPages,
        page,
        setPage,
        loading,
        refresh,
        take,
    } = usePaginatedList<UserResponse>(UserService.list, 10);

    const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openDeleteModal = useCallback((id: number) => setDeleteModalId(id), []);
    const closeDeleteModal = useCallback(() => setDeleteModalId(null), []);

    const handleEdit = useCallback((id: number) => router.push(`/admin/users/edit/${id}`), [router]);
    const handleCreate = useCallback(() => router.push("/admin/users/create"), [router]);

    const showPagination = useMemo(
        () => !loading && users.length > 0 && totalPages > 1,
        [loading, users.length, totalPages]
    );

    const handleDelete = useCallback(async () => {
        if (!deleteModalId) return;
        setIsDeleting(true);
        try {
            await UserService.remove(deleteModalId);
            toastSuccess("User deleted successfully");

            const newTotal = total - 1;
            const isLastItemOnPage = users.length === 1;
            const maxIndexOnCurrentPage = (page - 1) * take;

            if (isLastItemOnPage && page > 1 && newTotal <= maxIndexOnCurrentPage) {
                setPage(page - 1);
            } else {
                refresh(page);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toastError(error.response?.data?.message || "Failed to delete user");
            } else {
                toastError("Unexpected error occurred");
            }
        } finally {
            setIsDeleting(false);
            setDeleteModalId(null);
        }
    }, [deleteModalId, page, take, total, users.length, refresh, setPage]);

    return (
        <>
            <AdminListTemplate title="Users" entityName="User" onCreateClick={handleCreate}>
                <UsersTable
                    users={users}
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
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </AdminListTemplate>

            <ConfirmModal
                isOpen={deleteModalId !== null}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this user? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </>
    );
};

export default memo(UsersListPageInner);