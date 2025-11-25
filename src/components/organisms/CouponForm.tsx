"use client";

import { memo, useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Form, InputField } from "@/src/components";
import type { CreateCouponRequest, UpdateCouponRequest, CouponResponse } from "@/src/models";
import { formatYMD } from "@/src/services";


type Mode = "create" | "edit";

type Inputs = {
    discount: number;
    active: boolean;
    validFrom: string;
    validTo: string;
};

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const CouponFormInner = ({
    mode,
    initial,
    onSubmit,
    isLoading,
    errorMessage,
}: {
    mode: Mode;
    initial?: CouponResponse;
    onSubmit: (payload: CreateCouponRequest | UpdateCouponRequest) => void;
    isLoading: boolean;
    errorMessage: string | null;
}) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm<Inputs>({
        mode: "onChange",
        defaultValues: {
            discount: initial?.discount ?? 0,
            active: initial?.active ?? true,
            validFrom: initial?.validFrom ? formatYMD(initial.validFrom) : "",
            validTo: initial?.validTo ? formatYMD(initial.validTo) : "",
        },
    });

    useEffect(() => {
        if (initial) {
            reset({
                discount: initial.discount,
                active: initial.active,
                validFrom: formatYMD(initial.validFrom),
                validTo: initial.validTo ? formatYMD(initial.validTo) : "",
            });
        }
    }, [initial, reset]);

    const submitText = useMemo(
        () => (mode === "create" ? "Create Coupon" : "Update Coupon"),
        [mode]
    );
    const disabled = useMemo(
        () => (mode === "create" ? !isValid || isLoading : !isValid || !isDirty || isLoading),
        [mode, isValid, isDirty, isLoading]
    );

    const validFrom = useWatch({ control, name: "validFrom" });

    const todayYMD = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return formatYMD(d);
    }, []);

    return (
        <Form
            onSubmit={handleSubmit((v) => {
                const payload =
                    mode === "create"
                        ? ({
                            discount: v.discount,
                            active: v.active,
                            validFrom: v.validFrom,
                            validTo: v.validTo ? v.validTo : null,
                        } as CreateCouponRequest)
                        : ({
                            discount: v.discount ?? null,
                            active: v.active ?? null,
                            validFrom: v.validFrom || null,
                            validTo: v.validTo ? v.validTo : null,
                        } as UpdateCouponRequest);

                onSubmit(payload);
            })}
            submitButton={{ text: submitText, disabled, isLoading, variant: "dark" }}
            errorMessage={errorMessage}
            className="space-y-5"
        >
            {/* Discount (0.0 - 1.0) */}
            <Controller
                name="discount"
                control={control}
                rules={{
                    required: "The field Discount is required.",
                    min: { value: 0.0, message: "The field Discount must be between 0.0 and 1.0." },
                    max: { value: 1.0, message: "The field Discount must be between 0.0 and 1.0." },
                }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="discount"
                            label="Discount (0.0 - 1.0)"
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            placeholder="e.g. 0.15"
                        />
                        <p className="text-red-600 text-sm">{errors.discount?.message}</p>
                    </>
                )}
            />

            {/* Valid From (YYYY-MM-DD) */}
            <Controller
                name="validFrom"
                control={control}
                rules={{
                    required: "The field ValidFrom is required.",
                    pattern: {
                        value: DATE_REGEX,
                        message: "The field ValidFrom must be in the format YYYY-MM-DD.",
                    },
                }}
                render={({ field }) => (
                    <>
                        <InputField {...field} id="validFrom" label="Valid From" type="date" />
                        <p className="text-red-600 text-sm">{errors.validFrom?.message}</p>
                    </>
                )}
            />

            {/* Valid To (YYYY-MM-DD) */}
            <Controller
                name="validTo"
                control={control}
                rules={{
                    validate: (v) => {
                        if (!v) return true;
                        if (!DATE_REGEX.test(v)) return "The field ValidTo must be in the format  YYYY-MM-DD.";
                        if (validFrom && v <= validFrom) return "The field ValidTo must be after ValidFrom field.";
                        if (v <= todayYMD) return "The field ValidTo must be after current date.";
                        return true;
                    },
                }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="validTo"
                            label="Valid To (Optional)"
                            type="date"
                            min={validFrom || todayYMD}
                            required={false}
                        />
                        <p className="text-red-600 text-sm">{errors.validTo?.message}</p>
                    </>
                )}
            />

            {/* Active */}
            <Controller
                name="active"
                control={control}
                render={({ field }) => (
                    <div className="flex items-center gap-2">
                        <input
                            id="active"
                            type="checkbox"
                            className="h-4 w-4"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <label htmlFor="active" className="text-sm text-gray-900 dark:text-gray-100">
                            Active
                        </label>
                    </div>
                )}
            />
        </Form>
    );
};

export const CouponForm = memo(CouponFormInner);