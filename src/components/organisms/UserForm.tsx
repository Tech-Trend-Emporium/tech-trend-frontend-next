"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, InputField, DropdownField } from "@/src/components";
import type { CreateUserRequest, UpdateUserRequest, UserResponse, Role } from "@/src/models";


type Mode = "create" | "edit";

type Inputs = {
    username: string;
    email: string;
    password: string;
    role: Role;
    isActive: boolean;
};

const roleOptions: Role[] = ["ADMIN", "EMPLOYEE", "SHOPPER"];

export const UserForm = ({
    mode,
    initial,
    onSubmit,
    isLoading,
    errorMessage
}: {
    mode: Mode;
    initial?: UserResponse;
    onSubmit: (payload: CreateUserRequest | UpdateUserRequest) => void;
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
        defaultValues: {
            username: initial?.username ?? "",
            email: initial?.email ?? "",
            password: "",
            role: initial?.role ?? "SHOPPER",
            isActive: initial?.isActive ?? true
        }
    });

    useEffect(() => {
        if (initial) {
            reset({
                username: initial.username,
                email: initial.email,
                password: "",
                role: initial.role,
                isActive: initial.isActive
            });
        }
    }, [initial, reset]);

    const submitText = mode === "create" ? "Create User" : "Update User";
    const disabled = mode === "create" ? !isValid || isLoading : !isValid || !isDirty || isLoading;

    return (
        <Form
            onSubmit={handleSubmit((v) => {
                if (mode === "create") {
                    const payload: CreateUserRequest = {
                        username: v.username.trim(),
                        email: v.email.trim(),
                        password: v.password,
                        role: v.role,
                        isActive: v.isActive
                    };
                    onSubmit(payload);
                } else {
                    const payload: UpdateUserRequest = {
                        username: v.username.trim(),
                        email: v.email.trim(),
                        role: v.role,
                        isActive: v.isActive
                    };
                    onSubmit(payload);
                }
            })}
            submitButton={{ text: submitText, disabled, isLoading, variant: "dark" }}
            errorMessage={errorMessage}
            className="space-y-5"
        >
            {/* Username */}
            <Controller
                name="username"
                control={control}
                rules={{
                    required: "The field Username is required.",
                    minLength: { value: 3, message: "The field Username must be between 3 and 50 characters." },
                    maxLength: { value: 50, message: "The field Username must be between 3 and 50 characters." },
                }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="username"
                            label="Username"
                            placeholder="e.g. sebas_01"
                        />
                        <p className="text-red-600 text-sm">{errors.username?.message}</p>
                    </>
                )}
            />

            {/* Email */}
            <Controller
                name="email"
                control={control}
                rules={{
                    required: "The field Email is required.",
                    maxLength: { value: 254, message: "The field Email must be a maximum length of 254 characters." },
                }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="email"
                            label="Email"
                            placeholder="name@example.com"
                            type="email"
                        />
                        <p className="text-red-600 text-sm">{errors.email?.message}</p>
                    </>
                )}
            />

            {/* Password (solo en create) */}
            {mode === "create" && (
                <Controller
                    name="password"
                    control={control}
                    rules={{
                        required: "The field Password is required.",
                        minLength: { value: 8, message: "The field Password must be between 8 and 100 characters." },
                        maxLength: { value: 100, message: "The field Password must be between 8 and 100 characters." },
                    }}
                    render={({ field }) => (
                        <>
                            <InputField
                                {...field}
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="Strong password"
                            />
                            <p className="text-red-600 text-sm">{errors.password?.message}</p>
                        </>
                    )}
                />
            )}

            {/* Role */}
            <Controller
                name="role"
                control={control}
                rules={{
                    validate: (v) =>
                        roleOptions.includes(v) ? true : "The provided role is not valid."
                }}
                render={({ field }) => (
                    <>
                        <DropdownField
                            id="role"
                            name="role"
                            label="Role"
                            options={roleOptions}
                            selected={field.value}
                            handleSelect={field.onChange}
                        />
                    </>
                )}
            />

            {/* isActive */}
            <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                    <div className="flex items-center gap-2">
                        <input
                            id="isActive"
                            type="checkbox"
                            className="h-4 w-4"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <label htmlFor="isActive" className="text-sm text-gray-900 dark:text-gray-100">
                            Active
                        </label>
                    </div>
                )}
            />
        </Form>
    );
};