"use client";

import { useForm, Controller } from "react-hook-form";
import { InputField, DropdownField, Form } from "@/src/components";
import { CreateProductRequest, UpdateProductRequest, ProductResponse } from "@/src/models";
import { useEffect } from "react";


type BaseInputs = {
    title: string;
    price: number;
    description: string;
    imageUrl: string;
    ratingRate: number;
    count: number;
    category: string;
};

type Mode = "create" | "edit";

export const ProductForm = ({
    mode,
    initial,
    categories,
    onSubmit,
    isLoading,
    errorMessage
}: {
    mode: Mode;
    initial?: ProductResponse;
    categories: string[];
    onSubmit: (payload: CreateProductRequest | UpdateProductRequest) => void;
    isLoading: boolean;
    errorMessage: string | null;
}) => {
    const {
        control, handleSubmit, reset,
        formState: { errors, isValid, isDirty }
    } = useForm<BaseInputs>({
        mode: "onChange",
        defaultValues: {
            title: initial?.title ?? "",
            price: initial?.price ?? 0,
            description: initial?.description ?? "",
            imageUrl: initial?.imageUrl ?? "",
            ratingRate: initial?.ratingRate ?? 0,
            count: initial?.count ?? 0,
            category: initial?.category ?? ""
        }
    });

    useEffect(() => {
        if (initial) reset({
            title: initial.title,
            price: initial.price,
            description: initial.description ?? "",
            imageUrl: initial.imageUrl ?? "",
            ratingRate: initial.ratingRate ?? 0,
            count: initial.count ?? 0,
            category: initial.category
        });
    }, [initial, reset]);

    const submitText = mode === "create" ? "Create Product" : "Update Product";
    const disabled = mode === "create" ? !isValid || isLoading : !isValid || !isDirty || isLoading;

    return (
        <Form
            onSubmit={handleSubmit((v) => {
                const payload = {
                    title: v.title,
                    price: v.price,
                    description: v.description || null,
                    imageUrl: v.imageUrl || null,
                    ratingRate: v.ratingRate || undefined,
                    count: v.count || undefined,
                    category: v.category
                };
                onSubmit(payload);
            })}
            submitButton={{ text: submitText, disabled, isLoading, variant: "dark" }}
            errorMessage={errorMessage}
            className="space-y-5"
        >
            {/* Title */}
            <Controller
                name="title"
                control={control}
                rules={{
                    required: "The field Title is required.",
                    maxLength: {
                        value: 200,
                        message: "The field Title must be a maximum length of 200 characters."
                    }
                }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="title"
                            label="Product Title"
                            placeholder="Enter product title"
                        />
                        <p className="text-red-600 text-sm">{errors.title?.message}</p>
                    </>
                )}
            />

            {/* Price */}
            <Controller
                name="price"
                control={control}
                rules={{
                    required: "The field Price is required.",
                    min: {
                        value: 0,
                        message: "The field Price must be between 0 and 999999999999.99."
                    },
                    max: {
                        value: 999999999999.99,
                        message: "The field Price must be between 0 and 999999999999.99."
                    }
                }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="price"
                            label="Price"
                            type="number"
                            placeholder="0.00"
                        />
                        <p className="text-red-600 text-sm">{errors.price?.message}</p>
                    </>
                )}
            />

            {/* Category Dropdown */}
            <Controller
                name="category"
                control={control}
                rules={{
                    required: "The field Category is required.",
                    minLength: {
                        value: 3,
                        message: "The field Category must be between 3 and 120 characters long."
                    },
                    maxLength: {
                        value: 120,
                        message: "The field Category must be between 3 and 120 characters long."
                    },
                    pattern: {
                        value: /^[a-zA-Z0-9\s\-\.\,&']+$/,
                        message: "The field Category can only contain letters, numbers, spaces, hyphens, periods, commas, ampersands, and apostrophes."
                    }
                }}
                render={({ field }) => (
                    <>
                        <DropdownField
                            id="category"
                            name="category"
                            label="Category"
                            options={categories}
                            selected={field.value}
                            handleSelect={field.onChange}
                        />
                        <p className="text-red-600 text-sm">{errors.category?.message}</p>
                    </>
                )}
            />

            {/* Description */}
            <Controller
                name="description"
                control={control}
                rules={{
                    maxLength: {
                        value: 2000,
                        message: "The field Description must be a maximum length of 2000 characters."
                    }
                }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="description"
                            label="Description (Optional)"
                            placeholder="Enter product description"
                            required={false}
                        />
                        <p className="text-red-600 text-sm">{errors.description?.message}</p>
                    </>
                )}
            />

            {/* Image URL */}
            <Controller
                name="imageUrl"
                control={control}
                rules={{
                    maxLength: {
                        value: 2048,
                        message: "The field ImageUrl must be a maximum length of 2048 characters."
                    },
                    pattern: {
                        value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                        message: "The field ImageUrl must be a valid URL."
                    }
                }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="imageUrl"
                            label="Image URL (Optional)"
                            placeholder="https://example.com/image.jpg"
                            required={false}
                        />
                        <p className="text-red-600 text-sm">{errors.imageUrl?.message}</p>
                    </>
                )}
            />

            {/* Rating Rate */}
            <Controller
                name="ratingRate"
                control={control}
                rules={{
                    min: {
                        value: 0,
                        message: "The field RatingRate must be between 0 and 5."
                    },
                    max: {
                        value: 5,
                        message: "The field RatingRate must be between 0 and 5."
                    }
                }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="ratingRate"
                            label="Rating Rate (Optional)"
                            type="number"
                            placeholder="0.0 - 5.0"
                            required={false}
                        />
                        <p className="text-red-600 text-sm">{errors.ratingRate?.message}</p>
                    </>
                )}
            />

            {/* Count */}
            <Controller
                name="count"
                control={control}
                rules={{
                    min: {
                        value: 0,
                        message: "The field Count cannot be negative."
                    }
                }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="count"
                            label="Stock Count (Optional)"
                            type="number"
                            placeholder="0"
                            required={false}
                        />
                        <p className="text-red-600 text-sm">{errors.count?.message}</p>
                    </>
                )}
            />
        </Form>
    );
};