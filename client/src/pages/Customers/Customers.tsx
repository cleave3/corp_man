import { useState } from "react";
import { Table, TableHeader, TableRow, TableCell, TableBody, TableLoader, Pagination } from "../../components/ui/table";
import { useCustomers } from "../../hooks/useApiHooks";
import { formatCurrency } from "../../utils";
import { formatDate } from "../../utils/date";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const Customers = () => {
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
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="">
                                        User
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
                <Pagination
                    loaded={pageData.length}
                    total={totalData}
                    page={currentPage}
                    limit={pageSize}
                    nextFunc={() => setFilterData((prev) => ({ ...prev, page: prev.page + 1 }))}
                    prevFunc={() => setFilterData((prev) => ({ ...prev, page: prev.page - 1 }))}
                />
            </div>
        </>
    );
};

export default Customers;
