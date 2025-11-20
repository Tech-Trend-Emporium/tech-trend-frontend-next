"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, InputField } from "@/src/components";
import type { CreateCategoryRequest, UpdateCategoryRequest, CategoryResponse } from "@/src/models";


type Mode = "create" | "edit";

type Inputs = {
    name: string;
};

export const CategoryForm = ({
    mode,
    initial,
    onSubmit,
    isLoading,
    errorMessage
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
        formState: { errors, isValid, isDirty }
    } = useForm<Inputs>({
        mode: "onChange",
        defaultValues: { name: initial?.name ?? "" }
    });

    useEffect(() => {
        if (initial) reset({ name: initial.name });
    }, [initial, reset]);

    const submitText = mode === "create" ? "Create Category" : "Update Category";
    const disabled = mode === "create"
        ? !isValid || isLoading
        : !isValid || !isDirty || isLoading;

    return (
        <Form
            onSubmit={handleSubmit(({ name }) => onSubmit({ name }))}
            submitButton={{ text: submitText, disabled, isLoading, variant: "dark" }}
            errorMessage={errorMessage}
            className="space-y-5"
        >
            <Controller
                name="name"
                control={control}
                rules={{
                    required: "The field Name is required.",
                    minLength: { value: 3, message: "The field Name must be at least 3 characters." },
                    maxLength: { value: 120, message: "The field Name must be at most 120 characters." },
                    pattern: {
                        value: /^[a-zA-Z0-9\s\-\.\,&']+$/,
                        message: "The field Name can only contain letters, numbers, spaces, hyphens, periods, commas, ampersands, and apostrophes."
                    }
                }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="name"
                            label="Category Name"
                            placeholder="e.g. Electronics"
                        />
                        <p className="text-red-600 text-sm">{errors.name?.message}</p>
                    </>
                )}
            />
        </Form>
    );
}