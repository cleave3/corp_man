import { useAuthStore } from "../../hooks/useAuthStore";
import { useGetMe } from "../../hooks/useApiHooks";
import Badge from "../ui/badge/Badge";

export default function UserMetaCard() {
    const { data, isLoading } = useGetMe();

    const user = useAuthStore((state) => state.user);

    const userData = data?.data ?? user;

    if (isLoading) {
        return (
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
        );
    }
    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                            {userData?.image_url ? (
                                <img src={userData.image_url} alt="user" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
                                    {`${userData?.first_name?.[0] ?? ""}${userData?.last_name?.[0] ?? ""}`.toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {userData?.first_name} {userData?.last_name}
                            </h4>
                            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <Badge
                                        variant="light"
                                        color={userData?.status === "active" ? "success" : "error"}
                                        children={userData?.status}
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
