import { useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useAuthStore } from "../../hooks/useAuthStore";
import UserInfoCard from "./UserInfoCard";
import UserMetaCard from "./UserMetaCard";
import UserPermissionsCard from "./UserPermissionsCard";

export default function UserProfiles() {
    const refreshAuth = useAuthStore((state) => state.refreshAuth);

    useEffect(() => {
        refreshAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <PageBreadcrumb pageTitle="Profile" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="space-y-6">
                    <UserMetaCard />
                    <UserInfoCard />
                    <UserPermissionsCard />
                </div>
            </div>
        </>
    );
}
