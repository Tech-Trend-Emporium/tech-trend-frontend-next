"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/src/auth";
import { RecoveryQuestionService } from "@/src/services";
import { AuthTemplate } from "@/src/components/templates";
import { SignUpForm } from "@/src/components/organisms/SignUpForm";
import { SignUpRequest, RecoveryQuestionResponseRaw } from "@/src/models";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [securityQuestions, setSecurityQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    RecoveryQuestionService.list()
      .then(res => setSecurityQuestions(res.items.map(q => q.question)))
      .catch(() => setFormError("Unable to load security questions"));
  }, []);

  const handleSubmit = async (payload: SignUpRequest) => {
    setIsLoading(true);
    setFormError(null);

    try {
      await signUp(payload);
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
        securityQuestions={securityQuestions}
        isLoading={isLoading}
        errorMessage={formError}
        onSubmit={handleSubmit}
      />
      <p className="text-center">Already registered? <span className="text-cyan-500 hover:underline"><a href="/sign-in">Log in</a></span></p>
    </AuthTemplate>
  );
}
