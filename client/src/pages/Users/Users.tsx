import { Table, TableHeader, TableRow, TableCell, TableBody, TableLoader } from "../../components/ui/table";
import { useGetUsers } from "../../hooks/useApiHooks";
import { formatDate } from "../../utils/date";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Badge from "../../components/ui/badge/Badge";
import { useAuthStore } from "../../hooks/useAuthStore";
import NewUser from "./NewUser";
import { useUserStore } from "../../hooks/useUserStore";
import { useModal } from "../../hooks/useModal";

const Users = () => {
    const { data, isLoading } = useGetUsers();
    const auth = useAuthStore((state) => state.user);

    const { openModal, closeModal, isOpen } = useModal();

    const { selectUser, selectedUser } = useUserStore((state) => state);

    if (isLoading) return <TableLoader />;

    return (
        <>
            <PageBreadcrumb pageTitle={`Team`} />

            <NewUser
                user={selectedUser}
                isOpen={isOpen}
                openModal={openModal}
                closeModal={() => {
                    closeModal();
                    selectUser(null);
                }}
            />
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mb-5">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px] hidden lg:block">
                        {/* Desktop Table */}
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader>User</TableCell>
                                    <TableCell isHeader>Email</TableCell>
                                    <TableCell isHeader>telephone</TableCell>
                                    <TableCell isHeader>User Type</TableCell>
                                    <TableCell isHeader>Status</TableCell>
                                    <TableCell isHeader>Last login</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {data?.data.map((user) => (
                                    <TableRow
                                        key={user.uid}
                                        className={user?.uid === auth?.uid ? "dark:bg-blue-100/10 bg-blue-100/50 dark:text-white" : ""}
                                        onClick={() => {
                                            selectUser(user);
                                            openModal();
                                        }}
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
                                        <TableCell>{user?.email}</TableCell>
                                        <TableCell>{user?.phone}</TableCell>
                                        <TableCell>{user?.user_type}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="light"
                                                children={user?.status}
                                                color={user?.status === "active" ? "success" : "error"}
                                            />
                                        </TableCell>
                                        <TableCell>{formatDate(user?.last_login, "llll")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {/* Mobile View */}
                    <div className="block lg:hidden">
                        {data?.data.map((user) => (
                            <div
                                key={user.uid}
                                className={`mb-4 rounded-lg border border-gray-100 dark:border-white/[0.05] p-4 bg-white dark:bg-white/[0.03] shadow-sm ${
                                    user?.uid === auth?.uid ? "dark:bg-blue-100/10 bg-blue-100/50 dark:text-white" : ""
                                }`}
                                onClick={() => {
                                    selectUser(user);
                                    openModal();
                                }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg">
                                        {`${user.name?.[0] ?? ""}${user.name?.[1] ?? ""}`}
                                    </div>
                                    <div>
                                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                            {user?.name}
                                        </span>
                                        <Badge
                                            variant="light"
                                            children={user?.status}
                                            color={user?.status === "active" ? "success" : "error"}
                                        />
                                        {/* <span className="block text-xs text-gray-500 dark:text-white/60">{user?.user_type}</span> */}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-700 dark:text-white/80">
                                    <div>
                                        <span className="font-semibold">Email: </span>
                                        {user?.email}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Phone: </span>
                                        {user?.phone}
                                    </div>
                                    {/* <div>
                                        <span className="font-semibold">Status: </span>
                                        <Badge
                                            variant="light"
                                            children={user?.status}
                                            color={user?.status === "active" ? "success" : "error"}
                                        />
                                    </div> */}
                                    <div>
                                        <span className="font-semibold">Last login: </span>
                                        {formatDate(user?.last_login, "llll")}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Users;
