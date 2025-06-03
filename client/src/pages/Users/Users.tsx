import { Table, TableHeader, TableRow, TableCell, TableBody, TableLoader } from "../../components/ui/table";
import { useGetUsers } from "../../hooks/useApiHooks";
import { formatDate } from "../../utils/date";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Badge from "../../components/ui/badge/Badge";
import { useAuthStore } from "../../hooks/useAuthStore";
const Users = () => {
    const { data, isLoading } = useGetUsers();

    const auth = useAuthStore((state) => state.user);

    if (isLoading) return <TableLoader />;

    return (
        <>
            <PageBreadcrumb pageTitle={`Team`} />
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="">
                                        User
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        Email
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        telephone
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        User Type
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        Status
                                    </TableCell>
                                    <TableCell isHeader className="">
                                        Last login
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {data?.data.map((user) => (
                                    <TableRow
                                        key={user.uid}
                                        className={user?.uid === auth?.uid ? "dark:bg-blue-100/10 bg-blue-100/50 dark:text-white" : ""}
                                    >
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg">
                                                    {`${user.name?.[0] ?? ""}${user.name?.[1] ?? ""}`}
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {user?.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="">{user?.email}</TableCell>
                                        <TableCell className="">{user?.phone}</TableCell>
                                        <TableCell className="">{user?.user_type}</TableCell>
                                        <TableCell className="">
                                            <Badge
                                                variant="light"
                                                children={user?.status}
                                                color={user?.status === "active" ? "success" : "error"}
                                            />
                                        </TableCell>
                                        <TableCell className="">{formatDate(user?.last_login, "llll")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Users;
