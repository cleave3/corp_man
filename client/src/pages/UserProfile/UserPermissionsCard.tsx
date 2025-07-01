import { useEffect } from "react";
import Checkbox from "../../components/form/input/Checkbox";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useUserStore } from "../../hooks/useUserStore";

const UserPermissionsCard = () => {
    const user = useAuthStore((state) => state.user);

    const { permissions, getUserPermissions } = useUserStore((state) => state);

    useEffect(() => {
        getUserPermissions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!user) {
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
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">Permissions</h4>
                    <div className="mt-4">
                        <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 w-full">
                            {Object.entries(permissions).map(([group, items]) => {
                                // Filter items where user has the permission
                                const filteredItems = items.filter((perm) => user.permissions.includes(perm.action));
                                // Only render group if it has at least one permission
                                if (filteredItems.length === 0) return null;
                                return (
                                    <div key={group} className="mb-6 break-inside-avoid">
                                        <div className="mb-2 font-medium text-gray-700 dark:text-gray-300 capitalize">{group}</div>
                                        <div className="flex flex-col gap-2">
                                            {filteredItems.map((perm) => (
                                                <Checkbox
                                                    key={perm.action}
                                                    disabled={true}
                                                    onChange={() => {}}
                                                    checked={true}
                                                    label={perm.name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPermissionsCard;
