"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserService } from "@/src/services";
import type { UserResponse } from "@/src/models";
import { toastSuccess, toastError } from "@/src/lib/toast";
import { AdminListTemplate, ConfirmModal, Pagination, UsersTable } from "@/src/components";
import { usePaginatedList } from "@/src/hooks/usePaginatedList";


export default function UsersListPage() {
    const router = useRouter();

    const { items: users, total, totalPages, page, setPage, loading, refresh, take } 
        = usePaginatedList<UserResponse>(UserService.list, 10);

    const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteModalId) return;
        setIsDeleting(true);
        try {
            await UserService.remove(deleteModalId);
            toastSuccess("User deleted successfully");

            const isLastItemOnPage = users.length === 1;
            const newTotal = total - 1;
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
    };

    const handleEdit = (id: number) => router.push(`/admin/users/edit/${id}`);
    const handleCreate = () => router.push("/admin/users/create");

    return (
        <>
            <AdminListTemplate title="Users" entityName="User" onCreateClick={handleCreate}>
                <UsersTable
                    users={users}
                    isLoading={loading}
                    onEdit={handleEdit}
                    onDelete={(id) => setDeleteModalId(id)}
                />

                {!loading && users.length > 0 && (
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
                message="Are you sure you want to delete this user? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </>
    );
}