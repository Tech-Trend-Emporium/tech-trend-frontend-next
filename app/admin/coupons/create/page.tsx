"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminFormTemplate, CouponForm } from "@/src/components";
import { CouponService } from "@/src/services";
import type { CreateCouponRequest } from "@/src/models";
import { toastSuccess } from "@/src/lib";


export default function CreateCouponPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (data: CreateCouponRequest) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            await CouponService.create(data);
            toastSuccess("Coupon created successfully");
            router.push("/admin/coupons");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message || "Failed to create coupon");
            } else {
                setErrorMessage("Unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitWrapper = (payload: unknown) => {
        void handleSubmit(payload as CreateCouponRequest);
    };

    return (
        <AdminFormTemplate title="Create Coupon" onBack={() => router.back()}>
            <CouponForm
                mode="create"
                onSubmit={handleSubmitWrapper}
                isLoading={isLoading}
                errorMessage={errorMessage}
            />
        </AdminFormTemplate>
    );
}