import { PaymentMethod } from "@/src/models";
import { memo } from "react";
import { FiCreditCard } from "react-icons/fi";


export const PaymentMethodSection = memo(function PaymentMethodSection({
    selected,
    onSelect,
    options,
}: {
    selected: PaymentMethod;
    onSelect: (m: PaymentMethod) => void;
    options: PaymentMethod[];
}) {
    return (
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/50">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
                    <FiCreditCard className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
                    Payment Method
                </h2>
            </div>
            <div className="p-5 space-y-3">
                {options.map((method) => (
                    <label
                        key={method}
                        className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ring-1 ${selected === method
                                ? "ring-gray-800 dark:ring-gray-200 bg-gray-50 dark:bg-gray-700/50"
                                : "ring-gray-200 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                            }`}
                    >
                        <input
                            type="radio"
                            name="paymentMethod"
                            value={method}
                            checked={selected === method}
                            onChange={() => onSelect(method)}
                            className="w-4 h-4 text-gray-800 dark:text-gray-200 focus:ring-gray-800 dark:focus:ring-gray-200"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                            {method === "CREDIT_CARD" ? "Credit Card" : "Debit Card"}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}, (a, b) => a.selected === b.selected && a.onSelect === b.onSelect && a.options === b.options);