"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiMapPin } from "react-icons/fi";


type AddressSectionProps = {
    value: string;
    onChange: (v: string) => void;
    onValidityChange?: (isValid: boolean) => void;
};

const MESSAGES = {
    required: "The field address is required.",
    length: "The field address must be between 8 and 120 characters.",
    whitespace: "The field address must not have leading or trailing spaces.",
} as const;

const MIN = 8;
const MAX = 120;

const AddressSectionInner = ({ value, onChange, onValidityChange }: AddressSectionProps) => {
    const [touched, setTouched] = useState(false);
    const lastValidityRef = useRef<boolean | null>(null);

    const { error, isValid, trimmed } = useMemo(() => {
        const hasLeadingOrTrailing = value !== value.trim();
        if (!value.trim()) {
            return { error: MESSAGES.required, isValid: false, trimmed: value.trim() };
        }
        if (hasLeadingOrTrailing) {
            return { error: MESSAGES.whitespace, isValid: false, trimmed: value.trim() };
        }
        const len = value.length;
        if (len < MIN || len > MAX) {
            return { error: MESSAGES.length, isValid: false, trimmed: value.trim() };
        }
        return { error: null as string | null, isValid: true, trimmed: value.trim() };
    }, [value]);

    useEffect(() => {
        if (!onValidityChange) return;
        if (lastValidityRef.current !== isValid) {
            lastValidityRef.current = isValid;
            onValidityChange(isValid);
        }
    }, [isValid, onValidityChange]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const next = e.target.value.slice(0, MAX);
            onChange(next);
        },
        [onChange]
    );

    const handleBlur = useCallback(() => {
        setTouched(true);
        if (value !== trimmed) onChange(trimmed);
    }, [onChange, trimmed, value]);

    const charCount = value.length;
    const showError = touched && !!error;

    return (
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/50">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
                    <FiMapPin className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
                    Delivery Address
                </h2>
            </div>

            <div className="p-5">
                <textarea
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full delivery address..."
                    rows={3}
                    maxLength={MAX}
                    aria-invalid={showError}
                    aria-describedby="address-help address-error"
                    className={[
                        "w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:border-transparent outline-none transition-colors resize-none",
                        showError
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-gray-800 dark:focus:ring-gray-200",
                    ].join(" ")}
                />

                <div className="mt-2 flex items-center justify-between">
                    <p id="address-help" className="text-xs text-gray-500 dark:text-gray-400">
                        {MIN}-{MAX} chars. No leading/trailing spaces.
                    </p>
                    <span
                        className={`text-xs ${charCount > MAX || charCount < MIN ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
                            }`}
                    >
                        {charCount}/{MAX}
                    </span>
                </div>

                {showError && (
                    <p id="address-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export const AddressSection = memo(AddressSectionInner);