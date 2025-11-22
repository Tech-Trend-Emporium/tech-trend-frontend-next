"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CategoryService } from "@/src/services";
import type { CategoryResponse, DeleteCategoryResult } from "@/src/models";
import { toastSuccess, toastError } from "@/src/lib";
import { AdminListTemplate, CategoriesTable, ConfirmModal, Pagination } from "@/src/components";
import { usePaginatedList } from "@/src/hooks";


export default function CategoriesListPage() {
    const router = useRouter();

    const { items: categories, total, totalPages, page, setPage, loading, refresh, take} = 
        usePaginatedList<CategoryResponse>(CategoryService.list, 10);

    const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteModalId) return;
        setIsDeleting(true);
        try {
            const result: DeleteCategoryResult = await CategoryService.remove(deleteModalId);

            if (result.kind === "accepted") {
                toastSuccess(result.data.message || "Category deletion pending approval");
                refresh(page);
            } else {
                toastSuccess("Category deleted successfully");

                const isLastItemOnPage = categories.length === 1;
                const newTotal = total - 1;
                const maxIndexOnCurrentPage = (page - 1) * take;

                if (isLastItemOnPage && page > 1 && newTotal <= maxIndexOnCurrentPage) {
                    setPage(page - 1);
                } else {
                    refresh(page);
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toastError(error.response?.data?.message || "Failed to delete category");
            } else {
                toastError("Unexpected error occurred");
            }
        } finally {
            setIsDeleting(false);
            setDeleteModalId(null);
        }
    };

    const handleEdit = (id: number) => router.push(`/admin/categories/edit/${id}`);
    const handleCreate = () => router.push("/admin/categories/create");

    return (
        <>
            <AdminListTemplate title="Categories" entityName="Category" onCreateClick={handleCreate}>
                <CategoriesTable
                    categories={categories}
                    isLoading={loading}
                    onEdit={handleEdit}
                    onDelete={(id) => setDeleteModalId(id)}
                />

                {!loading && categories.length > 0 && (
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
                message="Are you sure you want to delete this category? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </>
    );
}