interface ErrorCodeProps {
    code: string;
}

export const ErrorCode = ({ code }: ErrorCodeProps) => {
    return (
        <h1 className="text-9xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {code}
        </h1>
    );
};