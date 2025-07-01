import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useGetBusiness } from "../../hooks/useApiHooks";
import BusinessInfo from "./BusinessInfo";
import Preferences from "./Preferences";

const Settings = () => {
    const { data, isLoading } = useGetBusiness();

    const businessInfo = data?.data;

    if (isLoading) {
        return (
            <>
                <PageBreadcrumb pageTitle={`Settings`} />
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 animate-pulse">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                            <div className="order-3 xl:order-2 flex flex-col gap-2">
                                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="flex flex-col items-center gap-1 xl:flex-row xl:gap-3">
                                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                    <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                                </div>
                            </div>
                        </div>
                        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    </div>
                </div>
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 animate-pulse my-5">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i}>
                                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 animate-pulse">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i}>
                                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <PageBreadcrumb pageTitle={`Settings`} />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="space-y-6">
                    <BusinessInfo data={businessInfo} />
                    <Preferences data={businessInfo?.preferences} />
                </div>
            </div>
        </>
    );
};

export default Settings;
