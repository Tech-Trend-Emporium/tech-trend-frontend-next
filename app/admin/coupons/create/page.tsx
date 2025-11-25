"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AdminFormTemplate, CouponForm } from "@/src/components";
import { CouponService } from "@/src/services";
import type { CreateCouponRequest, UpdateCouponRequest } from "@/src/models";
import { toastSuccess } from "@/src/lib";


const CreateCouponPageInner = () => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const handleSubmit = useCallback((data: CreateCouponRequest | UpdateCouponRequest) => {
        if (isLoading) return;
        if (mounted.current) {
            setIsLoading(true);
            setErrorMessage(null);
        }

        (async () => {
            try {
                await CouponService.create(data as CreateCouponRequest);
                toastSuccess("Coupon created successfully");
                router.push("/admin/coupons");
            } catch (error) {
                if (!mounted.current) return;
                if (axios.isAxiosError(error)) {
                    setErrorMessage(error.response?.data?.message || "Failed to create coupon");
                } else {
                    setErrorMessage("Unexpected error occurred");
                }
            } finally {
                if (mounted.current) setIsLoading(false);
            }
        })();
    }, [isLoading, router]);

    const onBack = useCallback(() => router.back(), [router]);

    return (
        <AdminFormTemplate title="Create Coupon" onBack={onBack}>
            <CouponForm
                mode="create"
                onSubmit={handleSubmit}
                isLoading={isLoading}
                errorMessage={errorMessage}
            />
        </AdminFormTemplate>
    );
};

export default memo(CreateCouponPageInner);