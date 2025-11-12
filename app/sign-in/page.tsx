"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { AuthTemplate, SignInForm } from "@/src/components";
import { SignInRequest } from "@/src/models";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/auth";


export default function SignInPage() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [formData, setFormData] = useState({
        emailOrUsername: "",
        password: "",
        rememberMe: false,
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const checkData = () => {
        const { emailOrUsername, password } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(emailOrUsername);
        const isPasswordFilled = password.trim() !== "";
        setIsFormValid(isEmailValid && isPasswordFilled);
    }

    useEffect(checkData, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        }));
        if (errorMessage) setErrorMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const payload: SignInRequest = {
                emailOrUsername: formData.emailOrUsername,
                password: formData.password,
            };

            const auth = await signIn(payload);
            const role = auth.role;
            if (role === "ADMIN" || role === "EMPLOYEE") router.push("/admin");
            else router.push("/products");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.status === 401 ? "Wrong credentials." : "Logging in error.");
            } else {
                setErrorMessage("Unexpected error.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthTemplate imageSrc="/icon.png" imageAlt="Sign up illustration">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
                Sign In
            </h2>
            <SignInForm
                formData={formData}
                errorMessage={errorMessage}
                isFormValid={isFormValid}
                isLoading={isLoading}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </AuthTemplate>
    );
};
