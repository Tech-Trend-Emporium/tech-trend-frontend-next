"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Form, InputField } from "../";


interface CreateCategoryInputs {
    name: string;
}

interface CreateCategoryFormProps {
    onSubmit: SubmitHandler<CreateCategoryInputs>;
    isLoading: boolean;
    errorMessage: string | null;
}

export const CreateCategoryForm = ({ onSubmit, isLoading, errorMessage }: CreateCategoryFormProps) => {
    const { formState: { errors, isValid }, control, handleSubmit } = useForm<CreateCategoryInputs>({
        mode: "onChange",
        defaultValues: {
            name: ""
        }
    });

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            submitButton={{
                text: "Add",
                disabled: !isValid || isLoading,
                isLoading,
            }}
            errorMessage={errorMessage}
        >
            <Controller
                name="name"
                control={control}
                rules={{
                    required: "Name is required",
                    pattern: {
                        value: /^[a-zA-Z0-9\s\-\.\,&]+$/,
                        message: "Name contains invalid characters"
                    },
                    minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters"
                    },
                    maxLength: {
                        value: 120,
                        message: "Name must be at most 120 characters"
                    }
                }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="name"
                            label="Name"
                            type="text"
                            placeholder="Enter category name"
                        />
                        <p className="text-red-600 text-sm">{errors.name?.message}</p>
                    </>
                )}
            />
        </Form>
    );
};