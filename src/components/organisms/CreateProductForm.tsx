"use client";

import { useForm, Controller } from "react-hook-form";
import { InputField, DropdownField, Form } from "@/src/components";
import { CreateProductRequest } from "@/src/models";


interface CreateProductInputs {
    title: string;
    price: number;
    description: string;
    imageUrl: string;
    ratingRate: number;
    count: number;
    category: string;
}

interface CreateProductFormProps {
    onSubmit: (data: CreateProductRequest) => void;
    isLoading: boolean;
    errorMessage: string | null;
    categories: string[];
}

export const CreateProductForm = ({
    onSubmit,
    isLoading,
    errorMessage,
    categories
}: CreateProductFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm<CreateProductInputs>({
        mode: "onChange",
        defaultValues: {
            title: "",
            price: 0,
            description: "",
            imageUrl: "",
            ratingRate: 0,
            count: 0,
            category: ""
        }
    });

    return (
        <Form
            onSubmit={handleSubmit((formValues) => {
                const payload: CreateProductRequest = {
                    title: formValues.title,
                    price: formValues.price,
                    description: formValues.description || null,
                    imageUrl: formValues.imageUrl || null,
                    ratingRate: formValues.ratingRate || undefined,
                    count: formValues.count || undefined,
                    category: formValues.category
                };
                onSubmit(payload);
            })}
            submitButton={{
                text: "Create Product",
                disabled: !isValid || isLoading,
                isLoading,
                variant: "dark"
            }}
            errorMessage={errorMessage}
            className="space-y-1"
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
                        value: /^[a-zA-Z0-9\s\-\.\,&]+$/,
                        message: "The field Category can only contain letters, numbers, spaces, and the following characters: - . , &"
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
                        />
                        <p className="text-red-600 text-sm">{errors.count?.message}</p>
                    </>
                )}
            />
        </Form>
    );
};
