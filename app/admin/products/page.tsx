"use client";

import { memo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toastSuccess, toastError } from "@/src/lib";
import { AdminListTemplate, ConfirmModal, Pagination, ProductsTable } from "@/src/components";
import { ProductService } from "@/src/services";
import type { ProductResponse, DeleteProductResult } from "@/src/models";
import { usePaginatedList } from "@/src/hooks";
import { useAuth } from "@/src/auth";


const ProductsListPageInner = () => {
    const router = useRouter();
    const { auth } = useAuth();
    const {
        items: products,
        total,
        totalPages,
        page,
        setPage,
        loading,
        refresh,
        take,
    } = usePaginatedList<ProductResponse>(ProductService.list, 10);

    const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const goCreate = useCallback(() => router.push("/admin/products/create"), [router]);
    const goEdit = useCallback((id: number) => router.push(`/admin/products/edit/${id}`), [router]);
    const openDelete = useCallback((id: number) => setDeleteModalId(id), []);
    const closeDelete = useCallback(() => setDeleteModalId(null), []);
    const handlePageChange = useCallback((p: number) => setPage(p), [setPage]);

    const handleDelete = useCallback(async () => {
        if (!deleteModalId) return;
        setIsDeleting(true);
        try {
            const result: DeleteProductResult = await ProductService.remove(deleteModalId);

            if (result.kind === "accepted") {
                toastSuccess(result.data.message || "Product deletion pending approval");
            } else {
                toastSuccess("Product deleted successfully");
            }

            const isLastItemOnPage = products.length === 1;
            const newTotal = Math.max(total - 1, 0);
            const maxIndexOnCurrentPage = (page - 1) * take;

            closeDelete();
            if (isLastItemOnPage && page > 1 && newTotal <= maxIndexOnCurrentPage) {
                setPage(page - 1);
            } else {
                refresh(page);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toastError(error.response?.data?.message || "Failed to delete product");
            } else {
                toastError("Unexpected error occurred");
            }
        } finally {
            setIsDeleting(false);
        }
    }, [deleteModalId, products.length, total, page, take, refresh, setPage, closeDelete]);

    const showPager = !loading && products.length > 0;

    return (
        <>
            <AdminListTemplate title="Products List" entityName="Product" onCreateClick={goCreate}>
                <ProductsTable
                    products={products}
                    isLoading={loading}
                    onEdit={goEdit}
                    onDelete={openDelete}
                    isAdmin={auth.isAuthenticated && auth?.role === "ADMIN"}
                />

                {showPager && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            totalItems={total}
                            itemsPerPage={take}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </AdminListTemplate>

            <ConfirmModal
                isOpen={deleteModalId !== null}
                onClose={closeDelete}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </>
    );
};

export default memo(ProductsListPageInner);