import React, { InputHTMLAttributes, useState, useEffect } from "react";

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    success?: boolean;
    error?: boolean;
}

const formatCurrency = (value: number | string): string => {
    if (value === "") return "";
    const num = typeof value === "number" ? value : parseFloat(value.replace(/,/g, ""));
    if (isNaN(num)) return "";

    // Format and remove unnecessary decimal zeroes
    const parts = num.toFixed(2).split(".");
    const intPart = parseInt(parts[1]) === 0 ? parts[0] : parts.join(".");
    return value == 0 ? '' : `₦${parseFloat(intPart).toLocaleString("en-NG")}`;
};

const parseCurrency = (formatted: string): number => {
    const raw = formatted.replace(/[₦,]/g, "");
    const parsed = parseFloat(raw);
    return isNaN(parsed) ? 0 : parsed;
};

const CurrencyInput: React.FC<CurrencyInputProps> = ({ value, onChange, success, disabled, error, className, ...rest }) => {
    const [display, setDisplay] = useState(formatCurrency(value));

    useEffect(() => {
        setDisplay(formatCurrency(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[₦]/g, "");

        // Allow only digits and up to one decimal point
        const cleaned = raw.replace(/[^0-9.]/g, "");
        const parts = cleaned.split(".");
        if (parts.length > 2 || parts[1]?.length > 2) return;

        setDisplay(raw); // Show as user types
        const numericValue = parseCurrency(cleaned);
        onChange(numericValue);
    };

    const handleBlur = () => {
        const numeric = parseCurrency(display);
        setDisplay(formatCurrency(numeric));
        onChange(numeric); // sync value if needed
    };

    let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${
        className || ""
    }`;

    if (disabled) {
        inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
    } else if (error) {
        inputClasses += ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
    } else if (success) {
        inputClasses += ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
    } else {
        inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800`;
    }

    return (
        <input
            type="text"
            value={display}
            onChange={handleChange}
            onBlur={handleBlur}
            inputMode="decimal"
            disabled={disabled}
            className={inputClasses}
            {...rest}
        />
    );
};

export default CurrencyInput;
