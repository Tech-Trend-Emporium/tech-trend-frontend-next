"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/src/auth";
import { AuthTemplate, SignInForm } from "@/src/components";
import { SignInRequest } from "@/src/models";
import Link from "next/link";
import { readFromStorage } from "@/src/utils";
import { toastSuccess } from "@/src/lib";


interface SignInInputs {
  emailOrUsername: string;
  password: string;
  rememberMe: boolean;
}

export default function SignInPage() {
  const router = useRouter();
  const { signIn, refresh } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const triedRef = useRef(false);

  useEffect(() => {
    if (triedRef.current) return;
    triedRef.current = true;

    const stored = readFromStorage?.();
    if (!stored?.refreshToken || stored?.accessToken) return;

    refresh()
      .then((auth) => {
        const role = auth.role;
        router.replace(role === "ADMIN" || role === "EMPLOYEE" ? "/admin" : "/shoplist");
      })
      .catch(() => {});
  }, [refresh, router]);

  const handleSubmit = async (data: SignInInputs) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload: SignInRequest = {
        emailOrUsername: data.emailOrUsername,
        password: data.password,
      };

      const auth = await signIn(payload);
      const role = auth.role;

      toastSuccess("Signed in successfully");

      router.replace(role === "ADMIN" || role === "EMPLOYEE" ? "/admin" : "/shoplist");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.status === 401 
            ? "Wrong credentials" 
            : "Sign in failed");
      } else {
        setErrorMessage("Unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthTemplate imageSrc="/icon.png" imageAlt="Sign in illustration">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
        Sign In
      </h2>

      <SignInForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        errorMessage={errorMessage} 
      />
      
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 text-center mt-3">
        Or create a new&nbsp;
        <span className="text-slate-500 dark:text-slate-400">
          <Link className="hover:underline" href="/auth/sign-up">account</Link>
        </span>
      </p>
    </AuthTemplate>
  );
}