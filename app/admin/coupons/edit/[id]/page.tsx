"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AdminFormTemplate, CouponForm } from "@/src/components";
import { CouponService } from "@/src/services";
import type { UpdateCouponRequest, CouponResponse } from "@/src/models";
import { toastError, toastSuccess } from "@/src/lib/toast";


export default function EditCouponPage() {
    const router = useRouter();
    const params = useParams();
    const couponId = Number(params.id);

    const [coupon, setCoupon] = useState<CouponResponse | null>(null);
    const [isLoadingCoupon, setIsLoadingCoupon] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await CouponService.getById(couponId);
                setCoupon(data);
            } catch (error) {
                console.error("Failed to fetch coupon", error);
                toastError("Failed to load coupon data");
                router.push("/admin/coupons");
            } finally {
                setIsLoadingCoupon(false);
            }
        })();
    }, [couponId, router]);

    const handleSubmit = async (payload: UpdateCouponRequest) => {
        setIsSubmitting(true);
        setErrorMessage(null);
        try {
            await CouponService.update(couponId, payload);
            toastSuccess("Coupon updated successfully");
            router.push("/admin/coupons");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message || "Failed to update coupon");
            } else {
                setErrorMessage("Unexpected error occurred");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingCoupon) {
        return (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200"></div>
            </div>
        );
    }

    if (!coupon) return null;

    return (
        <AdminFormTemplate title="Edit Coupon" onBack={() => router.back()}>
            <CouponForm
                mode="edit"
                initial={coupon}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
                errorMessage={errorMessage}
            />
        </AdminFormTemplate>
    );
}