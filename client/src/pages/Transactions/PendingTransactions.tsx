import { useState } from "react";
import { CheckIcon, XMarkIcon, ListBulletIcon } from "@heroicons/react/24/solid";
import { Transaction } from "../../api/types";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Badge from "../../components/ui/badge/Badge";
import { Modal } from "../../components/ui/modal";
import { TableLoader, Table, TableHeader, TableRow, TableCell, TableBody } from "../../components/ui/table";
import { useApproveTransaction, useDeclineTransaction, usePendingTransactions } from "../../hooks/useApiHooks";
import { useModal } from "../../hooks/useModal";
import { formatCurrency } from "../../utils";
import { formatDate } from "../../utils/date";
import TransactionDetail from "./TransactionDetail";
import Button from "../../components/button/Button";
import ConfirmationModal from "../../components/confirm";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

const PendingTransactions = () => {
    const [openDropDown, setOpenDropDown] = useState(false);
    const [index, setInex] = useState(0);

    function toggleDropdown() {
        setOpenDropDown((prev) => !prev);
    }

    function closeDropdown() {
        setOpenDropDown(false);
        setInex(0);
    }
    const [actionParams, setActionParams] = useState<{ id?: string; action?: "approve" | "decline" }>({});
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction>(null);

    const { closeModal, isOpen, openModal } = useModal();

    const { data, isLoading } = usePendingTransactions();

    const { mutate: aMutate } = useApproveTransaction();
    const { mutate: dMutate } = useDeclineTransaction();
    console.log({ actionParams });
    const handleProcessAction = () => {
        if (actionParams.action === "approve") {
            aMutate(actionParams.id);
            setActionParams({});
        } else {
            dMutate(actionParams.id);
            setActionParams({});
        }
    };

    const pageData = data?.data?.transactions ?? [];

    // const isPending = aIspending || dIspending;

    if (isLoading) return <TableLoader />;
    return (
        <>
            <PageBreadcrumb pageTitle={`Pending Transactions`} />
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                {/* Desktop/Tablets Table */}
                {pageData.length === 0 ? (
                    <div className="text-center text-gray-400 dark:text-gray-500 py-8">No pending transactions found.</div>
                ) : (
                    <div className="hidden md:block max-w-full overflow-x-auto min-h-screen">
                        <div className="min-w-[1102px]">
                            <Table>
                                {/* Table Header */}
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell isHeader>ID</TableCell>
                                        <TableCell isHeader>Amount</TableCell>
                                        <TableCell isHeader>Type</TableCell>
                                        {/* <TableCell isHeader>Status</TableCell> */}
                                        <TableCell isHeader>Description</TableCell>
                                        <TableCell isHeader>Initiator</TableCell>
                                        <TableCell isHeader>Created At</TableCell>
                                        <TableCell isHeader>{""}</TableCell>
                                    </TableRow>
                                </TableHeader>
                                {/* Table Body */}
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {pageData.map((transaction, i) => (
                                        <TableRow key={transaction.id} className="cursor-pointer">
                                            <TableCell>{transaction?.id}</TableCell>
                                            <TableCell>{formatCurrency(transaction?.amount)}</TableCell>
                                            <TableCell>
                                                {transaction?.transaction_type}
                                                {transaction?.meta_data?.customer ? ` (${transaction?.meta_data?.customer})` : ""}
                                            </TableCell>
                                            {/* <TableCell>
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
                                        </TableCell> */}
                                            <TableCell>{transaction?.description}</TableCell>
                                            <TableCell>{transaction?.initiator?.name}</TableCell>
                                            <TableCell>{formatDate(transaction?.created_at, "llll")}</TableCell>
                                            <TableCell>
                                                <div className="relative inline-block">
                                                    <button
                                                        className="dropdown-toggle"
                                                        onClick={() => {
                                                            setInex(i + 1);
                                                            toggleDropdown();
                                                        }}
                                                    >
                                                        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                                                    </button>
                                                    <Dropdown
                                                        isOpen={openDropDown && index === i + 1}
                                                        onClose={closeDropdown}
                                                        className="w-40 p-2"
                                                    >
                                                        <DropdownItem
                                                            onItemClick={() => {
                                                                setSelectedTransaction(transaction);
                                                                openModal();
                                                                closeDropdown();
                                                            }}
                                                            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                                        >
                                                            View Details
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            onItemClick={() => {
                                                                setActionParams({ action: "approve", id: transaction?.id });
                                                                closeDropdown();
                                                            }}
                                                            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-success-400 hover:text-white dark:text-gray-400  dark:hover:text-gray-300"
                                                        >
                                                            Approve
                                                        </DropdownItem>

                                                        <DropdownItem
                                                            onItemClick={() => {
                                                                setActionParams({ action: "decline", id: transaction?.id });
                                                                closeDropdown();
                                                            }}
                                                            className="flex w-full font-normal text-left text-gray-500 rounded-lg  hover:text-white hover:bg-red-500 dark:hover:text-white"
                                                        >
                                                            Decline
                                                        </DropdownItem>
                                                    </Dropdown>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
                {/* Mobile Cards */}
                <div className="block md:hidden px-2 py-4">
                    {pageData.length === 0 ? (
                        <div className="text-center text-gray-400 dark:text-gray-500 py-8">No pending transactions found.</div>
                    ) : (
                        pageData.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="mb-4 rounded-xl border border-gray-200 dark:border-white/[0.07] p-4 shadow transition hover:shadow-md cursor-pointer"
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

                                    <div className="flex gap-2">
                                        <Button
                                            variant="secondary"
                                            // size="icon"
                                            className="p-1 h-7 w-7"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedTransaction(transaction);
                                                openModal();
                                            }}
                                        >
                                            <ListBulletIcon className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="success"
                                            // size="icon"
                                            className="p-1 h-7 w-7"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setActionParams({ action: "approve", id: transaction?.id });
                                            }}
                                        >
                                            <CheckIcon className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            // size="icon"
                                            className="p-1 h-7 w-7"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setActionParams({ action: "decline", id: transaction?.id });
                                            }}
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
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
            <ConfirmationModal
                title={`Are you sure you want to ${actionParams?.action} this transaction?`}
                isOpen={!!actionParams?.id}
                onCancel={() => setActionParams({})}
                onConfirm={handleProcessAction}
            />
        </>
    );
};

export default PendingTransactions;
