"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { AuthTemplate, SignUpForm } from "@/src/components";
import { useSignUp } from "@/src/hooks";


const SignUpPageInner = () => {
  const {
    securityQuestions,
    loadingQuestions,
    isSubmitting,
    errorMessage,
    handleSubmit,
  } = useSignUp();

  const isLoading = useMemo(() => isSubmitting || loadingQuestions, [isSubmitting, loadingQuestions]);

  return (
    <AuthTemplate imageSrc="/icon.png" imageAlt="Sign up illustration">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
        Sign Up
      </h2>

      <SignUpForm
        securityQuestions={securityQuestions}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
      />

      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 text-center mt-3">
        Already registered?&nbsp;
        <span className="text-slate-500 dark:text-slate-400">
          <Link className="hover:underline" href="/auth/sign-in">
            Log in
          </Link>
        </span>
      </p>
    </AuthTemplate>
  );
};

export default memo(SignUpPageInner);