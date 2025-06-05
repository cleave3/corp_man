import { useNavigate } from "react-router";
import StatsCard from "../../components/stats/StatsCard";
import { useOverviewStats } from "../../hooks/useApiHooks";
import { Money, PageIcon, UserGroup } from "../../icons";
import { formatCurrencyShort, formatNumber, ROUTES } from "../../utils";

const OverviewStats = () => {
    const { data, isLoading } = useOverviewStats();

    const stats = data?.data;
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            <StatsCard
                icon={<Money className="size-6 text-white/90 dark:text-black" />}
                isLoading={isLoading}
                title={"Customers Balances"}
                value={formatCurrencyShort(stats?.total_balances)}
            />
            <StatsCard
                onClick={() => navigate(`${ROUTES.PENDING_TRANSACTIONS}`)}
                icon={<PageIcon className="size-6 text-white/90 dark:text-black" />}
                isLoading={isLoading}
                title={"Pending Transactions"}
                value={formatNumber(stats?.total_pending_transactions)}
            />
            <StatsCard
                onClick={() => navigate(ROUTES.CUSTOMERS)}
                icon={<UserGroup className="size-6 text-white/90 dark:text-black" />}
                isLoading={isLoading}
                title={"Customers"}
                value={formatNumber(stats?.total_customers)}
            />
            <StatsCard
                isLoading={isLoading}
                title={"Staffs"}
                value={formatNumber(stats?.total_staffs)}
                onClick={() => navigate(ROUTES.USERS)}
            />
        </div>
    );
};

export default OverviewStats;
