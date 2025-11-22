"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CouponService } from "@/src/services";
import type { CouponResponse } from "@/src/models";
import { toastSuccess, toastError } from "@/src/lib";
import { AdminListTemplate, ConfirmModal, CouponsTable, Pagination } from "@/src/components";
import { usePaginatedList } from "@/src/hooks";


export default function CouponsListPage() {
    const router = useRouter();

    const { items: coupons, total, totalPages, page, setPage, loading, refresh, take } = 
        usePaginatedList<CouponResponse>(CouponService.list, 10);

    const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteModalId) return;
        setIsDeleting(true);
        try {
            await CouponService.remove(deleteModalId);
            toastSuccess("Coupon deleted successfully");

            const newTotal = total - 1;
            const isLastItemOnPage = coupons.length === 1;
            const maxIndexOnCurrentPage = (page - 1) * take;

            if (isLastItemOnPage && page > 1 && newTotal <= maxIndexOnCurrentPage) {
                setPage(page - 1);
            } else {
                refresh(page);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toastError(error.response?.data?.message || "Failed to delete coupon");
            } else {
                toastError("Unexpected error occurred");
            }
        } finally {
            setIsDeleting(false);
            setDeleteModalId(null);
        }
    };

    const handleEdit = (id: number) => router.push(`/admin/coupons/edit/${id}`);
    const handleCreate = () => router.push("/admin/coupons/create");

    return (
        <>
            <AdminListTemplate title="Coupons" onCreateClick={handleCreate} entityName="Coupon">
                <CouponsTable
                    coupons={coupons}
                    isLoading={loading}
                    onEdit={handleEdit}
                    onDelete={(id) => setDeleteModalId(id)}
                />

                {!loading && coupons.length > 0 && (
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
                message="Are you sure you want to delete this coupon? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </>
    );
}