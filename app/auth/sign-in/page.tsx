"use client";

import { memo } from "react";
import Link from "next/link";
import { AuthTemplate, SignInForm } from "@/src/components";
import { useSignIn } from "@/src/hooks";


const SignInPageInner = () => {
  const { isLoading, errorMessage, handleSubmit } = useSignIn();

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

      <div className="text-center mt-4">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:underline transition-colors"
        >
          Forgot your password?
        </Link>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            or
          </span>
        </div>
      </div>

      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 text-center">
        Don&apos;t have an account?&nbsp;
        <span className="text-slate-500 dark:text-slate-400">
          <Link className="hover:underline" href="/auth/sign-up">
            Create one
          </Link>
        </span>
      </p>
    </AuthTemplate>
  );
};

export default memo(SignInPageInner);