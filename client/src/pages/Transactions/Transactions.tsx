import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { TableLoader, Table, TableHeader, TableRow, TableCell, TableBody, Pagination } from "../../components/ui/table";
import { useTransactions } from "../../hooks/useApiHooks";
import { formatCurrency, PERMISSION_VALUES, ROUTES } from "../../utils";
import { formatDate } from "../../utils/date";
import Badge from "../../components/ui/badge/Badge";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import { Transaction } from "../../api/types";
import TransactionDetail from "./TransactionDetail";
import Input from "../../components/form/input/InputField";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Button from "../../components/button/Button";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import SearchableSelect from "../../components/form/SearchableSelect";
import AccessWrapper from "../../components/AccessController";

const Transactions = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [params] = useSearchParams();
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction>(null);
    const [filterData, setFilterData] = useState({ page: 1, limit: 15, start_date: "", status: "", end_date: "" });

    const { closeModal, isOpen, openModal } = useModal();

    const { data, isLoading } = useTransactions(filterData);

    const pageData = data?.data?.transactions ?? [];

    const currentPage = data?.data?.page ?? 1;

    const pageSize = data?.data?.limit ?? 15;

    const totalData = data?.data?.total ?? 0;

    const navigate = useNavigate();

    useEffect(() => {
        const status = params.get("status");
        if (status) {
            setFilterData((prev) => ({ ...prev, status }));
        }
    }, [params]);

    if (isLoading) return <TableLoader length={filterData.limit} />;
    return (
        <>
            <PageBreadcrumb pageTitle={`Transactions`} />
            <div className="relative flex justify-between flex-wrap mb-5">
                <AccessWrapper componentPermissions={[PERMISSION_VALUES.transaction.initiate_transaction]}>
                    <Button
                        onClick={() => navigate(ROUTES.NEW_TRANSACTIONS)}
                        variant="primary"
                        leftIcon={<PlusIcon className="size-6" />}
                        children="New Transaction"
                    />
                </AccessWrapper>
                <button
                    type="button"
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    onClick={() => setShowFilters((prev) => !prev)}
                    aria-label="Show Filters"
                >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-gray-700 dark:text-white">
                        <path
                            d="M3 5h18M6 12h12M10 19h4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                <Dropdown isOpen={showFilters} onClose={() => setShowFilters((prev) => !prev)} className="p-2">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <label className="text-xs text-gray-500 min-w-[110px] sm:text-right sm:mr-2" htmlFor="transaction-status">
                                Transaction Status
                            </label>
                            <SearchableSelect
                                value={filterData?.status}
                                options={[
                                    { value: "", label: "All" },
                                    { value: "cancelled", label: "Cancelled" },
                                    { value: "completed", label: "Completed" },
                                    { value: "pending", label: "Pending" }
                                ]}
                                placeholder="Transaction Status"
                                onChange={(value) => setFilterData((prev) => ({ ...prev, status: value }))}
                                className="dark:bg-dark-900 w-40"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <label className="text-xs text-gray-500 min-w-[110px] sm:text-right sm:mr-2" htmlFor="start-date">
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
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <label className="text-xs text-gray-500 min-w-[110px] sm:text-right sm:mr-2" htmlFor="end-date">
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
                </Dropdown>
            </div>

            <div className="hidden lg:block max-w-full overflow-x-auto">
                <Pagination
                    loaded={pageData.length}
                    total={totalData}
                    page={currentPage}
                    limit={pageSize}
                    nextFunc={() => setFilterData((prev) => ({ ...prev, page: prev.page + 1 }))}
                    prevFunc={() => setFilterData((prev) => ({ ...prev, page: prev.page - 1 }))}
                />
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="hidden lg:block max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="">
                                        ID
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        Amount
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        Type
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        Status
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        Description
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        Initiator
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        Created At
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {pageData.map((transaction) => (
                                    <TableRow
                                        key={transaction.id}
                                        onClick={() => {
                                            setSelectedTransaction(transaction);
                                            openModal();
                                        }}
                                    >
                                        <TableCell className="">{transaction?.id}</TableCell>
                                        <TableCell className="">{formatCurrency(transaction?.amount)}</TableCell>
                                        <TableCell>
                                            {transaction?.transaction_type}
                                            {transaction?.meta_data?.customer ? ` (${transaction?.meta_data?.customer})` : ""}
                                        </TableCell>
                                        <TableCell className="">
                                            <Badge
                                                variant="light"
                                                children={transaction?.status}
                                                color={
                                                    transaction?.status === "completed"
                                                        ? "success"
                                                        : transaction?.status === "pending"
                                                        ? "warning"
                                                        : "error"
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="">{transaction?.description}</TableCell>
                                        <TableCell className="">{transaction?.initiator?.name}</TableCell>
                                        <TableCell className="">{formatDate(transaction?.created_at, "llll")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="block lg:hidden px-2 py-4">
                    <Pagination
                        loaded={pageData.length}
                        total={totalData}
                        page={currentPage}
                        limit={pageSize}
                        nextFunc={() => setFilterData((prev) => ({ ...prev, page: prev.page + 1 }))}
                        prevFunc={() => setFilterData((prev) => ({ ...prev, page: prev.page - 1 }))}
                    />
                    {pageData.length === 0 ? (
                        <div className="text-center text-gray-400 dark:text-gray-500 py-8">No transactions found.</div>
                    ) : (
                        pageData.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="mb-4 rounded-xl border border-gray-200 dark:border-white/[0.07] p-4 shadow transition hover:shadow-md cursor-pointer"
                                onClick={() => {
                                    setSelectedTransaction(transaction);
                                    openModal();
                                }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-1/2">
                                        {/* <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Amount</div> */}
                                        <div className="text-sm font-bold text-gray-900 dark:text-success-600">
                                            {formatCurrency(transaction?.amount)}
                                        </div>
                                    </div>
                                    <Badge
                                        variant="light"
                                        children={transaction?.status}
                                        color={
                                            transaction?.status === "completed"
                                                ? "success"
                                                : transaction?.status === "pending"
                                                ? "warning"
                                                : "error"
                                        }
                                    />
                                </div>
                                <div className="flex flex-wrap gap-y-2 mb-2">
                                    <div className="w-1/2">
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Type</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-200">
                                            {transaction?.transaction_type}{" "}
                                            {transaction?.meta_data?.customer ? ` (${transaction?.meta_data?.customer})` : ""}
                                        </div>
                                    </div>
                                    <div className="w-1/2 mt-2">
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Created</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-200">
                                            {formatDate(transaction?.created_at, "lll")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    setSelectedTransaction(null);
                    closeModal();
                }}
                className="max-w-[700px] m-2"
            >
                {selectedTransaction && <TransactionDetail selectedTransaction={selectedTransaction} />}
            </Modal>
        </>
    );
};

export default Transactions;
