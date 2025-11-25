"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AdminFormTemplate, CouponForm } from "@/src/components";
import { CouponService } from "@/src/services";
import type { UpdateCouponRequest, CouponResponse } from "@/src/models";
import { toastError, toastSuccess } from "@/src/lib";


const EditCouponPageInner = () => {
    const router = useRouter();
    const params = useParams();

    const couponId = useMemo(() => Number(params.id), [params.id]);

    const [coupon, setCoupon] = useState<CouponResponse | null>(null);
    const [isLoadingCoupon, setIsLoadingCoupon] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        (async () => {
            try {
                const data = await CouponService.getById(couponId);
                if (mounted.current) setCoupon(data);
            } catch {
                toastError("Failed to load coupon data");
                router.push("/admin/coupons");
            } finally {
                if (mounted.current) setIsLoadingCoupon(false);
            }
        })();
        return () => {
            mounted.current = false;
        };
    }, [couponId, router]);

    const handleSubmit = useCallback(
        async (payload: UpdateCouponRequest) => {
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
        },
        [couponId, router]
    );

    const onBack = useCallback(() => router.back(), [router]);

    if (isLoadingCoupon) {
        return (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200" />
            </div>
        );
    }

    if (!coupon) return null;

    return (
        <AdminFormTemplate title="Edit Coupon" onBack={onBack}>
            <CouponForm
                mode="edit"
                initial={coupon}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
                errorMessage={errorMessage}
            />
        </AdminFormTemplate>
    );
};

export default memo(EditCouponPageInner);