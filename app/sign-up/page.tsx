"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/auth";
import { SignUpRequest } from "@/src/models";
import { AuthTemplate, securityQuestions, SignUpForm } from "@/src/components";


export default function SignUpPage() {
    const router = useRouter();
    const { signUp } = useAuth();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        securityQuestion: "",
        securityAnswer: "",
    });
    const [errorMessage, setErrorMessage] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        securityQuestion: "",
        securityAnswer: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setformError] = useState<string | null>(null);

    const handleSelect = (value: string) => {
        setFormData((prev) => ({ ...prev, securityQuestion: value }));
    };
    const validateField = (name: string, value: string) => {
        let message = "";

        switch (name) {
            case "username":
                if (!value.trim()) message = "Username is required";
                break;
            case "email":
                if (!emailRegex.test(value)) message = "Enter a valid email address";
                break;
            case "password":
                if (!passwordRegex.test(value))
                    message =
                    "Password must have at least 8 chars, 1 uppercase, 1 lowercase, 1 number, and 1 special char (no spaces)";
                break;
            case "confirmPassword":
                if (value !== formData.password) message = "Passwords do not match";
                break;
            case "securityQuestion":
                if (!value.trim()) message = "Select a security question";
                break;
            case "securityAnswer":
                if (!value.trim()) message = "Provide an answer";
                break;
        }

        // update errors
        setErrorMessage((prev) => ({ ...prev, [name]: message }));
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        validateField(name, value);
    };

    const isFormValid = (() => {
        const isEmailValid = emailRegex.test(formData.email);
        const isPasswordValid = formData.password.length >= 6;
        return (isEmailValid && isPasswordValid && (formData.password === formData.confirmPassword)
                && (securityQuestions.includes(formData.securityQuestion)) && Boolean(formData.securityAnswer.trim()) 
                && Boolean(formData.username.trim()));
    })();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        Object.entries(formData).forEach(([name, value]) =>
        validateField(name, value));

        const hasErrors = Object.values(errorMessage).some((err) => err !== "");
        if (hasErrors) return;

        const payload: SignUpRequest = {
            email : formData.email,
            username : formData.username,
            password : formData.password};
        
        setIsLoading(true);
        
        
        try {
            await signUp(payload);
            router.push('/sign-in');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setformError(error.response?.status === 409
                    ? `Error ${error.response?.status}: Conflict, may username and/or email are already taken, try again.`
                    : `Error ${error.response?.status}: Sign up error, try again later.`);

            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthTemplate imageSrc="/icon.png" imageAlt="Sign up illustration">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
                Sign Up
            </h2>
            <SignUpForm
                formData={formData}
                errorMessage={errorMessage}
                isFormValid={isFormValid}
                isLoading={isLoading}
                formError={formError}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleSelect={handleSelect}
            />
        </AuthTemplate>
    );
};