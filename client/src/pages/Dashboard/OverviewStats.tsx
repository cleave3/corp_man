import { useNavigate } from "react-router";
import StatsCard from "../../components/stats/StatsCard";
import { useOverviewStats } from "../../hooks/useApiHooks";
import { Money, PageIcon, UserGroup } from "../../icons";
import { formatCurrencyShort, formatNumber, PERMISSION_VALUES, ROUTES } from "../../utils";
import AccessWrapper from "../../components/AccessController";

const OverviewStats = () => {
    const { data, isLoading } = useOverviewStats();

    const stats = data?.data;
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            <AccessWrapper componentPermissions={[PERMISSION_VALUES.dashboard.dashboard_balances]}>
                <StatsCard
                    icon={<Money className="size-6 text-white/90 dark:text-black" />}
                    isLoading={isLoading}
                    title={"Customers Balances"}
                    value={formatCurrencyShort(stats?.total_balances)}
                />
            </AccessWrapper>
            <AccessWrapper componentPermissions={[PERMISSION_VALUES.dashboard.dashboard_pending]}>
                <StatsCard
                    onClick={() => navigate(`${ROUTES.PENDING_TRANSACTIONS}`)}
                    icon={<PageIcon className="size-6 text-white/90 dark:text-black" />}
                    isLoading={isLoading}
                    title={"Pending Transactions"}
                    value={formatNumber(stats?.total_pending_transactions)}
                />
            </AccessWrapper>
            <AccessWrapper componentPermissions={[PERMISSION_VALUES.dashboard.dashboard_customers]}>
                <StatsCard
                    onClick={() => navigate(ROUTES.CUSTOMERS)}
                    icon={<UserGroup className="size-6 text-white/90 dark:text-black" />}
                    isLoading={isLoading}
                    title={"Customers"}
                    value={formatNumber(stats?.total_customers)}
                />
            </AccessWrapper>
            <AccessWrapper componentPermissions={[PERMISSION_VALUES.dashboard.dashboard_staffs]}>
                <StatsCard
                    isLoading={isLoading}
                    title={"Staffs"}
                    value={formatNumber(stats?.total_staffs)}
                    onClick={() => navigate(ROUTES.USERS)}
                />
            </AccessWrapper>
        </div>
    );
};

export default OverviewStats;
