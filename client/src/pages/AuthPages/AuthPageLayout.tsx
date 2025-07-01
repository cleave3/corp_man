import React from "react";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import { useTheme } from "../../context/ThemeContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    const logo = theme === "dark" ? "/corpman_darkmode.png" : "/corpman_lightmode.png";

    return (
        <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
            <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
                {children}
                <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
                    <div className="relative flex items-center justify-center z-1">
                        <div className="flex flex-col items-center max-w-screen-sm">
                            <span className="text-5xl font-black tracking-widest text-brand-500 dark:text-white select-none">
                                <img loading="lazy" src={logo} height={200} width={200} />
                            </span>
                            <p className="text-center text-gray-400 text-title-sm dark:text-white/60 mt-3">Organize. Optimize. Corpman.</p>
                        </div>
                    </div>
                </div>
                <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
                    <ThemeTogglerTwo />
                </div>
            </div>
        </div>
    );
}
