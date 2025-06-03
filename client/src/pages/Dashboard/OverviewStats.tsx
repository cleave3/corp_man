import StatsCard from "../../components/stats/StatsCard";
import { useOverviewStats } from "../../hooks/useApiHooks";
import { Money, PageIcon, UserGroup } from "../../icons";
import { formatCurrencyShort, formatNumber } from "../../utils";

const OverviewStats = () => {
    const { data, isLoading } = useOverviewStats();

    const stats = data?.data;
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            <StatsCard
                icon={<Money className="size-6 text-white/90 dark:text-black" />}
                isLoading={isLoading}
                title={"Customers Balances"}
                value={formatCurrencyShort(stats?.total_balances)}
            />
            <StatsCard
                icon={<PageIcon className="size-6 text-white/90 dark:text-black" />}
                isLoading={isLoading}
                title={"Pending Transactions"}
                value={formatNumber(stats?.total_pending_transactions)}
            />
            <StatsCard
                icon={<UserGroup className="size-6 text-white/90 dark:text-black" />}
                isLoading={isLoading}
                title={"Customers"}
                value={formatNumber(stats?.total_customers)}
            />
            <StatsCard isLoading={isLoading} title={"Staffs"} value={formatNumber(stats?.total_staffs)} />
        </div>
    );
};

export default OverviewStats;
