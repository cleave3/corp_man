import { useState } from "react";
import { Table, TableHeader, TableRow, TableCell, TableBody, TableLoader, Pagination } from "../../components/ui/table";
import { useCustomers } from "../../hooks/useApiHooks";
import { formatCurrency } from "../../utils";
import { formatDate } from "../../utils/date";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { PlusIcon } from "@heroicons/react/24/solid";
import Button from "../../components/button/Button";
import NewCustomer from "./NewCustomer";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";

const Customers = () => {
    const { closeModal, isOpen, openModal } = useModal();

    const [filterData, setFilterData] = useState({ page: 1, limit: 15 });

    const { data, isLoading } = useCustomers(filterData);

    const pageData = data?.data?.customers ?? [];

    const currentPage = data?.data?.page ?? 1;

    const pageSize = data?.data?.limit ?? 15;

    const totalData = data?.data?.total ?? 0;

    if (isLoading) return <TableLoader length={filterData.limit} />;

    return (
        <>
            <PageBreadcrumb pageTitle={`Customers`} />
            <div className="relative flex justify-start flex-wrap mb-5">
                <Button onClick={openModal} variant="primary" leftIcon={<PlusIcon className="size-6" />} children="New Customer" />
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="hidden md:block max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="">
                                        Customer
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        Current Balance
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        Email
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        telephone
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        Next Payment Date
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        Address
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        Created At
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        Created By
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {pageData.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                {customer?.image_url ? (
                                                    <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
                                                        <img
                                                            width={40}
                                                            height={40}
                                                            src={customer.image_url}
                                                            alt={customer.first_name}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg">
                                                        {`${customer.first_name?.[0] ?? ""}${customer.last_name?.[0] ?? ""}`}
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {customer?.first_name} {customer?.last_name}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="">{formatCurrency(customer?.balance)}</TableCell>
                                        <TableCell className="">{customer?.email}</TableCell>
                                        <TableCell className="">{customer?.phone}</TableCell>
                                        <TableCell className="">{formatDate(customer?.next_payment_date)}</TableCell>
                                        <TableCell className="">{customer?.address}</TableCell>
                                        <TableCell className="">{formatDate(customer?.created_at, "llll")}</TableCell>
                                        <TableCell className="">{customer?.creator?.name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="hidden md:block max-w-full overflow-x-auto">
                    <Pagination
                        loaded={pageData.length}
                        total={totalData}
                        page={currentPage}
                        limit={pageSize}
                        nextFunc={() => setFilterData((prev) => ({ ...prev, page: prev.page + 1 }))}
                        prevFunc={() => setFilterData((prev) => ({ ...prev, page: prev.page - 1 }))}
                    />
                </div>
                {/* Mobile Cards */}
                <div className="block md:hidden px-2 py-4">
                    <Pagination
                        loaded={pageData.length}
                        total={totalData}
                        page={currentPage}
                        limit={pageSize}
                        nextFunc={() => setFilterData((prev) => ({ ...prev, page: prev.page + 1 }))}
                        prevFunc={() => setFilterData((prev) => ({ ...prev, page: prev.page - 1 }))}
                    />
                    {pageData.length === 0 ? (
                        <div className="text-center text-gray-400 dark:text-gray-500 py-8">No customers found.</div>
                    ) : (
                        pageData.map((customer) => (
                            <div
                                key={customer.id}
                                className="mb-4 rounded-xl border border-gray-200 dark:border-white/[0.07] p-4 shadow transition hover:shadow-md cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-1/2">
                                        <div className="flex items-center gap-3">
                                            {customer?.image_url ? (
                                                <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
                                                    <img
                                                        width={40}
                                                        height={40}
                                                        src={customer.image_url}
                                                        alt={customer.first_name}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg">
                                                    {`${customer.first_name?.[0] ?? ""}${customer.last_name?.[0] ?? ""}`}
                                                </div>
                                            )}
                                            <div>
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {customer?.first_name} {customer?.last_name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-y-2 mb-2">
                                    <div className="w-1/2">
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Balance</div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-success-600">
                                            {formatCurrency(customer?.balance)}
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Email</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-200">{customer?.email ?? "-"}</div>
                                    </div>
                                    <div className="w-1/2">
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Telephone</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-200">{customer?.phone ?? "-"}</div>
                                    </div>
                                    <div className="w-1/2">
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Next Payment Date</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-200">
                                            {formatDate(customer?.next_payment_date)}
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Address</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-200">{customer?.address ?? "-"}</div>
                                    </div>
                                    <div className="w-1/2 mt-2">
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Created</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-200">
                                            {formatDate(customer?.created_at, "lll")}
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Created By</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-200">{customer?.creator?.name ?? "-"}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-2 h-auto">
                <NewCustomer closeModal={closeModal} />
            </Modal>
        </>
    );
};

export default Customers;
