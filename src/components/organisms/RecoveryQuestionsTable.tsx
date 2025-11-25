"use client";

import { memo } from "react";
import type { RecoveryQuestionResponse } from "@/src/models";


interface RecoveryQuestionsTableProps {
    questions: RecoveryQuestionResponse[];
    isLoading: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const RecoveryQuestionsTableInner = ({
    questions,
    isLoading,
    onEdit,
    onDelete,
}: RecoveryQuestionsTableProps) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200" />
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                No recovery questions found
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                ID
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                Question
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {questions.map((q) => (
                            <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{q.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{q.question}</td>
                                <td className="px-6 py-4 text-sm text-right space-x-2">
                                    <button
                                        onClick={() => onEdit(q.id)}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(q.id)}
                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                {questions.map((q) => (
                    <div key={q.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                                    {q.question}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">ID: {q.id}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 text-sm">
                            <button
                                onClick={() => onEdit(q.id)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(q.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

const areEqual = (
    prev: Readonly<RecoveryQuestionsTableProps>,
    next: Readonly<RecoveryQuestionsTableProps>
) => {
    return (
        prev.isLoading === next.isLoading &&
        prev.questions === next.questions &&
        prev.onEdit === next.onEdit &&
        prev.onDelete === next.onDelete
    );
};

export const RecoveryQuestionsTable = memo(RecoveryQuestionsTableInner, areEqual);