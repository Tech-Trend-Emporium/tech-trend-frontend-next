"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { AuthTemplate, SignInForm } from "@/src/components";
import { SignInRequest } from "@/src/models";
import { useAuth } from "@/src/auth";
import { SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";


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

  useEffect(() => {
      const promise = refresh();
      promise.then((auth) => {
        const role = auth.role;
        if (role === "ADMIN" || role === "EMPLOYEE") {
          router.push("/admin");
        } else {
          router.push("/products");
        }
      }).catch ((Error) => console.log(Error))
  },[]);

  const handleSubmit: SubmitHandler<SignInInputs> = async (data) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload: SignInRequest = {
        emailOrUsername: data.emailOrUsername,
        password: data.password,
      };

      const auth = await signIn(payload);
      const role = auth.role;


      if (role === "ADMIN" || role === "EMPLOYEE") {
        router.push("/admin");
      } else {
        router.push("/products");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.status === 401
            ? "Wrong credentials."
            : "Logging in error."
        );
      } else {
        setErrorMessage("Unexpected error.");
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

      <SignInForm onSubmit={handleSubmit} isLoading={isLoading} errorMessage={errorMessage}/>
      <p className="text-center">Or create a new <span className="text-cyan-500 hover:underline"><a href="/sign-up">account</a></span></p>
    </AuthTemplate>
  );
}
