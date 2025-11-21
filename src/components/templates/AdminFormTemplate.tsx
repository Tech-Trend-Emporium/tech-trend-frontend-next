interface AdminFormTemplateProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
}

export const AdminFormTemplate = ({ 
  children, 
  title,
  onBack 
}: AdminFormTemplateProps) => (
  <div className="h-full bg-gray-50 dark:bg-gray-900 px-4 py-8 flex items-center justify-center">
    <div className="h-full w-full max-w-6xl relative">
      {/* Back Button - Positioned absolutely to the left */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute left-0 top-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center gap-2 z-10 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Back</span>
        </button>
      )}
      
      {/* Form Container - Truly centered */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-200 dark:border-gray-700">
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