"use client";

import { memo, useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Form, InputField } from "@/src/components";
import type { CreateRecoveryQuestionRequest, UpdateRecoveryQuestionRequest, RecoveryQuestionResponse } from "@/src/models";


type Mode = "create" | "edit";

type Inputs = {
    question: string;
};

interface Props {
    mode: Mode;
    initial?: RecoveryQuestionResponse;
    onSubmit: (payload: CreateRecoveryQuestionRequest | UpdateRecoveryQuestionRequest) => void;
    isLoading: boolean;
    errorMessage: string | null;
}

const RecoveryQuestionFormInner = ({
    mode,
    initial,
    onSubmit,
    isLoading,
    errorMessage,
}: Props) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm<Inputs>({
        mode: "onChange",
        defaultValues: { question: initial?.question ?? "" },
    });

    useEffect(() => {
        if (initial) {
            reset({ question: initial.question });
        }
    }, [initial, reset]);

    const questionVal = useWatch({
        control,
        name: "question",
        defaultValue: initial?.question ?? "",
    });

    const submitText = useMemo(
        () => (mode === "create" ? "Create Recovery Question" : "Update Recovery Question"),
        [mode]
    );

    const disabled = useMemo(() => {
        const base = !isValid || isLoading;
        return mode === "create" ? base : base || !isDirty;
    }, [mode, isValid, isDirty, isLoading]);

    return (
        <Form
            onSubmit={handleSubmit((v) => {
                const payload = { question: v.question.trim() };
                onSubmit(payload);
            })}
            submitButton={{ text: submitText, disabled, isLoading, variant: "dark" }}
            errorMessage={errorMessage}
            className="space-y-5"
        >
            <Controller
                name="question"
                control={control}
                rules={{
                    required: "Question is required.",
                    minLength: { value: 1, message: "Question must be between 1 and 2000 characters." },
                    maxLength: { value: 2000, message: "Question must be between 1 and 2000 characters." },
                }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="question"
                            label="Question"
                            placeholder="e.g. What is your first pet's name?"
                        />
                        <div className="flex justify-between">
                            <p className="text-red-600 text-sm">{errors.question?.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{questionVal.length}/2000</p>
                        </div>
                    </>
                )}
            />
        </Form>
    );
};

const areEqual = (prev: Readonly<Props>, next: Readonly<Props>) => {
    return (
        prev.mode === next.mode &&
        prev.initial === next.initial &&
        prev.onSubmit === next.onSubmit &&
        prev.isLoading === next.isLoading &&
        prev.errorMessage === next.errorMessage
    );
};

export const RecoveryQuestionForm = memo(RecoveryQuestionFormInner, areEqual);