import React from "react";
import GridShape from "../../components/common/GridShape";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
            <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
                {children}
                <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
                    <div className="relative flex items-center justify-center z-1">
                        <GridShape />
                        <div className="flex flex-col items-center max-w-xs">
                            <span className="text-5xl font-black tracking-widest text-brand-500 dark:text-white select-none">
                              <span className="inline-block align-middle mr-2">
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                  <rect x="2" y="2" width="32" height="32" rx="8" fill="#2563EB" />
                                  <text
                                    x="18"
                                    y="25"
                                    textAnchor="middle"
                                    fontSize="18"
                                    fontWeight="bold"
                                    fill="white"
                                    fontFamily="sans-serif"
                                  >
                                    C
                                  </text>
                                </svg>
                              </span>
                              corpman
                            </span>
                            <p className="text-center text-gray-400 dark:text-white/60"></p>
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
