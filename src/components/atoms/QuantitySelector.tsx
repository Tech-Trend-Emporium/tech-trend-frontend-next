"use client";


export interface QuantitySelectorProps {
    quantity: number;
    onChange: (quantity: number) => void;
    min?: number;
    max?: number;
    label?: string;
}

export const QuantitySelector = ({
    quantity,
    onChange,
    min = 1,
    max = 99,
    label = "Quantity",
}: QuantitySelectorProps) => {
    const handleDecrement = () => {
        if (quantity > min) {
            onChange(quantity - 1);
        }
    };

    const handleIncrement = () => {
        if (quantity < max) {
            onChange(quantity + 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= min && value <= max) {
            onChange(value);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-right sm:text-left">
                {label}
            </label>
            <div className="inline-flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={quantity <= min}
                    className="w-10 h-12 flex items-center justify-center text-gray-600 dark:text-gray-400 
            hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed 
            transition-colors"
                    aria-label="Decrease quantity"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>

                <input
                    type="number"
                    value={quantity}
                    onChange={handleInputChange}
                    min={min}
                    max={max}
                    className="w-12 h-12 text-center text-gray-900 dark:text-gray-100 bg-transparent 
            border-x-2 border-gray-300 dark:border-gray-600 font-medium
            focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    aria-label="Quantity"
                />

                <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={quantity >= max}
                    className="w-10 h-12 flex items-center justify-center text-gray-600 dark:text-gray-400 
            hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed 
            transition-colors"
                    aria-label="Increase quantity"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        </div>
    );
};