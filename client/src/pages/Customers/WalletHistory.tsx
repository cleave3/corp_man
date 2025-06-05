import { useState } from "react";
import { useWalletHistory } from "../../hooks/useApiHooks";
import { Customer, StaticFunc } from "../../api/types";
import { Pagination } from "../../components/ui/table";
import { formatCurrency } from "../../utils";
import { formatDate } from "../../utils/date";
import { Drawer } from "../../components/Drawer.tsx/Drawer";
import Input from "../../components/form/input/InputField";

const WalletHistory = ({ customer, onClose }: { customer: Customer; onClose: StaticFunc }) => {
    const [filterData, setFilterData] = useState({ page: 1, limit: 15, start_date: "", end_date: "" });

    const { data, isLoading } = useWalletHistory(customer?.id, filterData);

    const pageData = data?.data?.wallet_history ?? [];

    const currentPage = data?.data?.page ?? 1;

    const pageSize = data?.data?.limit ?? 15;

    const totalData = data?.data?.total ?? 0;

    return (
        <Drawer
            title={
                <div>
                    <h2 className="text-lg font-semibold">
                        {customer?.first_name} {customer?.first_name} Wallet History
                    </h2>

                    <div className="mt-2">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Balance</div>
                        <div className="text-xl text-gray-700 dark:text-gray-200 font-bold">{formatCurrency(customer?.balance)}</div>
                    </div>
                    <div className="flex gap-4 mt-3">
                        <div className="flex flex-col  sm:items-center gap-1 sm:gap-2">
                            <label className="text-xs text-gray-500 dark:text-gray-300 min-w-[110px] sm:text-left" htmlFor="start-date">
                                Start Date
                            </label>
                            <Input
                                id="start-date"
                                type="date"
                                placeholder="Start Date"
                                className="w-60"
                                value={filterData?.start_date}
                                onChange={(e) => setFilterData((prev) => ({ ...prev, start_date: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-col sm:items-center gap-1 sm:gap-2">
                            <label className="text-xs text-gray-500 dark:text-gray-300 min-w-[110px] sm:text-left" htmlFor="end-date">
                                End Date
                            </label>
                            <Input
                                id="end-date"
                                type="date"
                                placeholder="End Date"
                                className="w-60"
                                value={filterData?.end_date}
                                onChange={(e) => setFilterData((prev) => ({ ...prev, end_date: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Pagination
                            loaded={pageData.length}
                            total={totalData}
                            page={currentPage}
                            limit={pageSize}
                            nextFunc={() => setFilterData((prev) => ({ ...prev, page: prev.page + 1 }))}
                            prevFunc={() => setFilterData((prev) => ({ ...prev, page: prev.page - 1 }))}
                        />
                    </div>
                </div>
            }
            isOpen={true}
            onClose={onClose}
            position="right"
            width="w-full lg:w-1/3"
        >
            {isLoading ? (
                <div className="block lg:hidden px-2 py-4">
                    {[...Array(5)].map((_, idx) => (
                        <div key={idx} className="mb-4 rounded-xl border border-gray-200 dark:border-white/[0.07] p-4 shadow animate-pulse">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-1/2 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                            <div className="flex flex-wrap gap-y-2 mb-2">
                                <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="w-1/2 mt-2 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="px-2 py-4">
                    {pageData.length === 0 ? (
                        <div className="text-center text-gray-400 dark:text-gray-500 py-8">No wallet history found.</div>
                    ) : (
                        pageData?.map((history) => (
                            <div
                                key={history.id}
                                className="mb-4 rounded-xl border border-gray-200 dark:border-white/[0.07] p-3 cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="">
                                        <div className="text-sm text-gray-700 dark:text-gray-200">{history?.description}</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-200">
                                            {formatDate(history?.created_at, "lll")}
                                        </div>
                                    </div>
                                    <div className="">
                                        {history?.credit ? (
                                            <div className="text-sm font-bold text-success-600">+{formatCurrency(history?.credit)}</div>
                                        ) : (
                                            <div className="text-sm font-bold text-red-600">-{formatCurrency(history?.debit)}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </Drawer>
    );
};

export default WalletHistory;
