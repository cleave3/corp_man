import { useGetMe } from "../../hooks/useApiHooks";
import { useAuthStore } from "../../hooks/useAuthStore";
import { formatDate } from "../../utils/date";

export default function UserInfoCard() {
    const { data, isLoading } = useGetMe();

    const user = useAuthStore((state) => state.user);

    const userData = data?.data ?? user;

    if (isLoading) {
        return (
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
        );
    }

    return (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">Personal Information</h4>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">First Name</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">{userData?.first_name}</p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Last Name</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">{userData?.last_name}</p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email address</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">{userData?.email}</p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Phone</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">{userData?.phone}</p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Last Login</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">{formatDate(userData?.last_login, "llll")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
