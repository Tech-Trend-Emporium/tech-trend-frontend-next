import { memo, type ReactNode } from "react";


interface AuthTemplateProps {
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}

function AuthTemplateInner({
  children,
  imageSrc = "./icon.png",
  imageAlt = "Authentication illustration",
}: AuthTemplateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row items-stretch justify-between bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-200 dark:border-gray-700">
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16">
          {children}
        </div>
        <div className="hidden md:flex w-full md:w-1/2 justify-center items-center bg-linear-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 p-12">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-linear-to-br from-slate-400/10 to-transparent dark:from-slate-600/10 rounded-3xl blur-2xl" />
            <img
              src={imageSrc}
              alt={imageAlt}
              className="relative rounded-2xl shadow-2xl object-contain transform hover:scale-105 transition-transform duration-300 max-w-md w-auto h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const AuthTemplate = memo(AuthTemplateInner);