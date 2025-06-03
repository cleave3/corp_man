import { GroupIcon } from "../../icons";

const StatsCard = ({ title, isLoading = false, value, icon = <GroupIcon className="size-6 text-white/90 dark:text-black" /> }) => {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:p-5">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl dark:bg-white">{icon}</div>

            <div className="flex items-end justify-between mt-4">
                <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
                    <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                        {isLoading ? <div className="h-6 w-16 bg-gray-200 rounded animate-pulse dark:bg-gray-700" /> : value}
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
