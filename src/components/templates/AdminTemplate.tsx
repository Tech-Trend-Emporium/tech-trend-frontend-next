interface AdminEntityTemplateProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
}

export const AdminEntityTemplate = ({
  children,
  title,
  onBack
}: AdminEntityTemplateProps) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
    <div className="max-w-2xl mx-auto">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-200 dark:border-gray-700">
        <div className="p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
            {title}
          </h1>
          {children}
        </div>
      </div>
    </div>
  </div>
);