import React, { ReactNode } from "react";
import clsx from "clsx";
import { XMarkIcon } from "@heroicons/react/24/solid";

type DrawerProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: ReactNode;
    width?: string;
    height?: string;
    position?: "left" | "right" | "top" | "bottom";
    children: React.ReactNode;
    backdrop?: boolean;
};

export const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    onClose,
    title = "",
    width = "w-64",
    height = "h-64",
    position = "left",
    children,
    backdrop = true
}) => {
    const isHorizontal = position === "left" || position === "right";

    const basePosition = {
        left: "left-0 top-0 h-full",
        right: "right-0 top-0 h-full",
        top: "top-0 left-0 w-full",
        bottom: "bottom-0 left-0 w-full"
    }[position];

    const translateClass = {
        left: isOpen ? "translate-x-0" : "-translate-x-full",
        right: isOpen ? "translate-x-0" : "translate-x-full",
        top: isOpen ? "translate-y-0" : "-translate-y-full",
        bottom: isOpen ? "translate-y-0" : "translate-y-full"
    }[position];

    const sizeClass = isHorizontal ? width : height;

    return (
        <>
            {backdrop && (
                <div
                    className={clsx(
                        "fixed inset-0 z-99999 bg-black/50 transition-opacity duration-300",
                        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}
                    onClick={onClose}
                />
            )}

            <div
                className={clsx(
                    "fixed z-99999 bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg",
                    "transition-transform duration-300 ease-in-out",
                    basePosition,
                    sizeClass,
                    translateClass,
                    "flex flex-col"
                )}
            >
                {/* Header with title and close button */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div>{title}</div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                    >
                        <XMarkIcon className="size-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto px-4">{children}</div>
            </div>
        </>
    );
};
