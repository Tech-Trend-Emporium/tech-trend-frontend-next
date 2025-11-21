"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/src/auth";
import { RecoveryQuestionService } from "@/src/services";
import { AuthTemplate, SignUpForm } from "@/src/components";
import type { SignUpRequest } from "@/src/models";
import Link from "next/link";
import { toastSuccess } from "@/src/lib/toast";


export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [securityQuestions, setSecurityQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const questions = useMemo(() => securityQuestions, [securityQuestions]);

  useEffect(() => {
    const ac = new AbortController();
    setLoadingQuestions(true);
    setFormError(null);

    (async () => {
      try {
        const res = await RecoveryQuestionService.list();
        setSecurityQuestions(res.items.map(q => q.question));
      } catch (err) {
        if (!axios.isCancel(err)) {
          setFormError("Unable to load security questions");
        }
      } finally {
        setLoadingQuestions(false);
      }
    })();

    return () => ac.abort();
  }, []);

  const handleSubmit = async (payload: SignUpRequest) => {
    if (isLoading) return;
    setIsLoading(true);
    setFormError(null);

    try {
      await signUp(payload);

      toastSuccess("Account created. You can log in now");
      
      router.push("/sign-in");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setFormError(
          error.response?.status === 409
            ? "Username or email already taken"
            : "Sign up failed"
        );
      } else {
        setFormError("Unexpected error occurred");
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
        securityQuestions={questions}
        isLoading={isLoading || loadingQuestions}
        errorMessage={formError}
        onSubmit={handleSubmit}
      />

      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 text-center mt-3">
        Already registered?&nbsp;
        <span className="text-slate-500 dark:text-slate-400">
          <Link className="hover:underline" href="/sign-in">Log in</Link>
        </span>
      </p>
    </AuthTemplate>
  );
}