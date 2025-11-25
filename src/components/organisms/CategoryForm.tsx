"use client";

import { memo, useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Form, InputField } from "@/src/components";
import type { CreateCategoryRequest, UpdateCategoryRequest, CategoryResponse } from "@/src/models";


type Mode = "create" | "edit";

type Inputs = {
    name: string;
};

const CategoryFormComponent = ({
    mode,
    initial,
    onSubmit,
    isLoading,
    errorMessage,
}: {
    mode: Mode;
    initial?: CategoryResponse;
    onSubmit: (payload: CreateCategoryRequest | UpdateCategoryRequest) => void;
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
        defaultValues: { name: initial?.name ?? "" },
    });

    useEffect(() => {
        if (initial) reset({ name: initial.name });
    }, [initial, reset]);

    const nameVal = useWatch({ control, name: "name", defaultValue: initial?.name ?? "" });

    const submitText = useMemo(
        () => (mode === "create" ? "Create Category" : "Update Category"),
        [mode]
    );

    const disabled = useMemo(() => {
        const base = !isValid || isLoading;
        return mode === "create" ? base : base || !isDirty;
    }, [mode, isValid, isDirty, isLoading]);

    const nameRules = useMemo(
        () => ({
            required: "The field Name is required.",
            minLength: { value: 3, message: "The field Name must be at least 3 characters." },
            maxLength: { value: 120, message: "The field Name must be at most 120 characters." },
            pattern: {
                value: /^[a-zA-Z0-9\s\-\.\,&']+$/,
                message:
                    "The field Name can only contain letters, numbers, spaces, hyphens, periods, commas, ampersands, and apostrophes.",
            },
        }),
        []
    );

    return (
        <Form
            onSubmit={handleSubmit(({ name }) => onSubmit({ name: name.trim() }))}
            submitButton={{ text: submitText, disabled, isLoading, variant: "dark" }}
            errorMessage={errorMessage}
            className="space-y-5"
        >
            <Controller
                name="name"
                control={control}
                rules={nameRules}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="name"
                            label="Category Name"
                            placeholder="e.g. Electronics"
                        />
                        <div className="flex justify-between">
                            <p className="text-red-600 text-sm">{errors.name?.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{nameVal.length}/120</p>
                        </div>
                    </>
                )}
            />
        </Form>
    );
};

export const CategoryForm = memo(CategoryFormComponent, (prev, next) => {
    return (
        prev.mode === next.mode &&
        prev.isLoading === next.isLoading &&
        prev.errorMessage === next.errorMessage &&
        prev.initial === next.initial &&
        prev.onSubmit === next.onSubmit
    );
});