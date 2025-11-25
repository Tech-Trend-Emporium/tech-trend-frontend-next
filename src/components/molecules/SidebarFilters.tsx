import { memo, useMemo } from "react";
import { Checklist, CheckboxFieldProps } from "@/src/components";


const SidebarFiltersInner = ({ items }: { items: CheckboxFieldProps[] }) => {
    const itemsMemo = useMemo(() => items, [items]);

    return (
        <aside className="lg:mt-11 lg:sticky lg:top-8 h-fit">
            <div className="rounded-2xl bg-white dark:bg-gray-800/80 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/60 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/50">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
                        <span className="w-1 h-6 bg-gray-800 dark:bg-gray-200 rounded-full mr-3"></span>
                        Filters
                    </h2>
                </div>
                <div className="p-5">
                    <Checklist items={itemsMemo} />
                </div>
            </div>
        </aside>
    );
};

export const SidebarFilters = memo(SidebarFiltersInner);