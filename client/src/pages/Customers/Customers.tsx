import { useState } from "react";
import { Table, TableHeader, TableRow, TableCell, TableBody, TableLoader, Pagination } from "../../components/ui/table";
import { useCustomers } from "../../hooks/useApiHooks";
import { formatCurrency, PERMISSION_VALUES } from "../../utils";
import { formatDate } from "../../utils/date";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { PlusIcon, MagnifyingGlassIcon, ArrowPathIcon, PencilIcon, ListBulletIcon } from "@heroicons/react/24/solid";
import Button from "../../components/button/Button";
import NewCustomer from "./NewCustomer";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import { Customer } from "../../api/types";
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import Input from "../../components/form/input/InputField";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import WalletHistory from "./WalletHistory";
import useWidth from "../../hooks/useWidth";
import SearchableSelect from "../../components/form/SearchableSelect";
import AccessWrapper from "../../components/AccessController";

const Customers = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [openDropDown, setOpenDropDown] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>(null);
    const [index, setInex] = useState(0);

    function toggleDropdown() {
        setOpenDropDown((prev) => !prev);
    }

    function closeDropdown() {
        setOpenDropDown(false);
        setInex(0);
    }

    const { closeModal, isOpen, openModal } = useModal();

    const { notDesktop } = useWidth();

    const [filterData, setFilterData] = useState({ page: 1, limit: 10, search: "", start_date: "", customer_type: "", end_date: "" });

    const { data, isLoading } = useCustomers(filterData);

    const pageData = data?.data?.customers ?? [];

    const currentPage = data?.data?.page ?? 1;

    const pageSize = data?.data?.limit ?? 10;

    const totalData = data?.data?.total ?? 0;

    if (isLoading) return <TableLoader length={filterData.limit} />;

    return (
        <>
            <PageBreadcrumb pageTitle={`Customers`} />
            <div className="relative flex justify-between items-center flex-wrap mb-5">
                <AccessWrapper componentPermissions={[PERMISSION_VALUES.customers.create_customers]}>
                    <Button onClick={openModal} variant="primary" leftIcon={<PlusIcon className="size-6" />} children="New Customer" />
                </AccessWrapper>
                <div className="flex items-center justify-end mt-3">
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
                                <label className="text-xs text-gray-500 min-w-[110px] sm:text-right sm:mr-2">Customer Type</label>
                                <SearchableSelect
                                    value={filterData?.customer_type}
                                    options={[
                                        { value: "", label: "All" },
                                        { value: "regular", label: "Regular" },
                                        { value: "premium", label: "Premium" }
                                    ]}
                                    placeholder="Customer Type"
                                    onChange={(value) => setFilterData((prev) => ({ ...prev, customer_type: value }))}
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
                        <div className="flex items-center justify-end mt-3">
                            <Input
                                value={searchInput}
                                placeholder="name/email..."
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        setFilterData((prev) => ({ ...prev, search: searchInput, page: 1 }));
                                    }
                                }}
                            />
                            <Button
                                className="ml-2 p-2 w-10 h-10 flex items-center"
                                variant="primary"
                                onClick={() => setFilterData((prev) => ({ ...prev, search: searchInput, page: 1 }))}
                            >
                                <MagnifyingGlassIcon className="size-6" />
                            </Button>

                            <Button
                                className="ml-2 p-2 w-10 h-10 flex items-center"
                                variant="secondary"
                                onClick={() => {
                                    setSearchInput("");
                                    setFilterData((prev) => ({
                                        ...prev,
                                        search: "",
                                        start_date: "",
                                        end_date: "",
                                        customer_type: "",
                                        page: 1
                                    }));
                                }}
                            >
                                <ArrowPathIcon className="size-6" />
                            </Button>
                        </div>
                    </Dropdown>
                </div>
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
                <div className="hidden lg:block max-w-full overflow-x-auto  min-h-screen">
                    <div className="min-w-[1102px]">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="">
                                        Name (Code)
                                    </TableCell>

                                    <AccessWrapper componentPermissions={[PERMISSION_VALUES.customers.view_balances]}>
                                        <TableCell isHeader className="">
                                            Current Balance
                                        </TableCell>
                                    </AccessWrapper>
                                    <TableCell isHeader className="">
                                        Customer Type
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
                                {pageData.map((customer, i) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            {/* <div className="flex items-center gap-3">
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
                                            </div> */}
                                            {customer?.first_name} {customer?.last_name}{" "}
                                            {customer?.customer_code ? `(${customer?.customer_code})` : ""}
                                        </TableCell>
                                        {/* <TableCell className="font-bold">{customer?.customer_code ?? "-"}</TableCell> */}
                                        <AccessWrapper componentPermissions={[PERMISSION_VALUES.customers.view_balances]}>
                                            <TableCell className="">{formatCurrency(customer?.balance)}</TableCell>
                                        </AccessWrapper>
                                        <TableCell className="">
                                            <span
                                                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                                    customer.customer_type === "premium"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-blue-100 text-blue-800"
                                                }`}
                                            >
                                                {customer.customer_type === "premium" ? "Premium" : "Regular"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="">{customer?.email ?? "-"}</TableCell>
                                        <TableCell className="">{customer?.phone}</TableCell>
                                        <TableCell className="">{formatDate(customer?.next_payment_date)}</TableCell>
                                        <TableCell className="">{customer?.address}</TableCell>
                                        <TableCell className="">{formatDate(customer?.created_at, "llll")}</TableCell>
                                        <TableCell className="">{customer?.creator?.name}</TableCell>
                                        <AccessWrapper
                                            componentPermissions={[
                                                PERMISSION_VALUES.customers.update_customers,
                                                PERMISSION_VALUES.customers.view_balances
                                            ]}
                                        >
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
                                                        <AccessWrapper
                                                            componentPermissions={[PERMISSION_VALUES.customers.update_customers]}
                                                        >
                                                            <DropdownItem
                                                                onItemClick={() => {
                                                                    setSelectedCustomer(customer);
                                                                    openModal();
                                                                    closeDropdown();
                                                                }}
                                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                                            >
                                                                Edit Customer
                                                            </DropdownItem>
                                                        </AccessWrapper>
                                                        <AccessWrapper componentPermissions={[PERMISSION_VALUES.customers.view_balances]}>
                                                            <DropdownItem
                                                                onItemClick={() => {
                                                                    setSelectedCustomer(customer);
                                                                    setDrawerOpen(true);
                                                                    closeDropdown();
                                                                }}
                                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                                            >
                                                                Wallet History
                                                            </DropdownItem>
                                                        </AccessWrapper>
                                                    </Dropdown>
                                                </div>
                                            </TableCell>
                                        </AccessWrapper>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
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
                                            {/* {customer?.image_url ? (
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
                                            )} */}
                                            <div>
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {customer?.first_name} {customer?.last_name}
                                                </span>
                                                <span
                                                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                                        customer.customer_type === "premium"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-blue-100 text-blue-800"
                                                    }`}
                                                >
                                                    {customer.customer_type === "premium" ? "Premium" : "Regular"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-1/2 flex justify-end">
                                        <AccessWrapper componentPermissions={[PERMISSION_VALUES.customers.update_customers]}>
                                            <Button
                                                variant="ghost"
                                                // size="icon"
                                                className="p-1 h-7 w-7 mx-2"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedCustomer(customer);
                                                    openModal();
                                                }}
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </Button>
                                        </AccessWrapper>
                                        <AccessWrapper componentPermissions={[PERMISSION_VALUES.customers.view_balances]}>
                                            <Button
                                                variant="secondary"
                                                className="p-1 h-7 w-7"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedCustomer(customer);
                                                    setDrawerOpen(true);
                                                }}
                                            >
                                                <ListBulletIcon className="h-4 w-4" />
                                            </Button>
                                        </AccessWrapper>
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
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Code</div>
                                        <div className="text-sm text-black dark:text-gray-200 font-bold">
                                            {customer?.customer_code ?? "-"}
                                        </div>
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
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Email</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-200">{customer?.email ?? "-"}</div>
                                    </div>
                                    <div className="w-full">
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Address</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-200">{customer?.address ?? "-"}</div>
                                    </div>
                                    <div className="w-1/2">
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
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    closeModal();
                    setSelectedCustomer(null);
                }}
                isFullscreen={notDesktop}
                className="max-w-[700px] m-2 h-auto"
            >
                <NewCustomer
                    closeModal={() => {
                        closeModal();
                        setSelectedCustomer(null);
                    }}
                    customerToEdit={selectedCustomer}
                />
            </Modal>
            {!!selectedCustomer && isDrawerOpen && (
                <WalletHistory
                    customer={selectedCustomer}
                    onClose={() => {
                        setSelectedCustomer(null);
                        setDrawerOpen(false);
                    }}
                />
            )}
        </>
    );
};

export default Customers;
