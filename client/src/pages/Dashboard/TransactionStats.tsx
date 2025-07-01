import AccessWrapper from "../../components/AccessController";
import { useOverviewStats } from "../../hooks/useApiHooks";
import { formatCurrencyShort, PERMISSION_VALUES } from "../../utils";

export default function TransactionStats() {
    const { data, isLoading } = useOverviewStats();

    const stats = data?.data;

    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
            <AccessWrapper componentPermissions={[PERMISSION_VALUES.dashboard.dashboard_collections]}>
                <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Transaction Stats</h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">All time transaction statistics</p>
                        </div>
                    </div>
                    <div className="relative ">
                        <div className="max-h-[330px] my-5 lg:my-10" id="chartDarkStyle">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-24">
                                    <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></span>
                                </div>
                            ) : (
                                <p className="text-6xl font-bold text-gray-900 dark:text-white text-center">
                                    {formatCurrencyShort(stats?.total_customer_deposits)}
                                </p>
                            )}
                        </div>
                    </div>
                    <p className="mx-auto mt-0 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">Total Collections</p>
                </div>
            </AccessWrapper>

            <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
                <AccessWrapper componentPermissions={[PERMISSION_VALUES.dashboard.dashboard_payouts]}>
                    <div>
                        <p className="mb-1 text-center text-red-700 text-theme-xl font-bold sm:text-sm">Payouts</p>
                        <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                            {formatCurrencyShort(stats?.total_payouts)}
                        </p>
                    </div>
                </AccessWrapper>

                <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

                <AccessWrapper componentPermissions={[PERMISSION_VALUES.dashboard.dashboard_revenue]}>
                    <div>
                        <p className="mb-1 text-center text-blue-500 text-theme-xl font-bold  sm:text-sm">Income</p>
                        <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                            {formatCurrencyShort(stats?.total_income)}
                        </p>
                    </div>
                </AccessWrapper>
            </div>
        </div>
    );
}
