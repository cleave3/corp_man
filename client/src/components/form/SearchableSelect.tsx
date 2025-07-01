import React, { useState, useRef, useEffect } from "react";

interface Option {
    label: string;
    value: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    success?: boolean;
    className?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select...",
    disabled,
    error,
    success,
    className = ""
}) => {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

    const filtered = options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()));

    const handleSelect = (val: string) => {
        onChange(val);
        setSearch("");
        setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    let baseClasses =
        "relative h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring bg-white text-gray-900 dark:text-gray-100 dark:bg-gray-900";
    if (disabled) {
        baseClasses +=
            " text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    } else if (error) {
        baseClasses +=
            " border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800";
    } else if (success) {
        baseClasses +=
            " border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800";
    } else {
        baseClasses += " border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800";
    }

    return (
        <div className="relative" ref={containerRef}>
            <input
                ref={inputRef}
                type="text"
                disabled={disabled}
                className={`${baseClasses} ${className}`}
                value={isOpen ? search : selectedLabel}
                onFocus={() => setIsOpen(true)}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setIsOpen(true);
                }}
                placeholder={placeholder}
                readOnly={!isOpen}
            />
            {isOpen && filtered.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white text-gray-900 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 shadow-md">
                    {filtered.map((opt) => (
                        <li
                            key={opt.value}
                            onClick={() => handleSelect(opt.value)}
                            className={`cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100 ${
                                selectedLabel === opt.label
                                    ? "bg-gray-200 dark:bg-gray-800"
                                    : ""
                            }`}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
            {isOpen && filtered.length === 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white text-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 shadow-md px-4 py-2 text-sm">
                    No results found
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
