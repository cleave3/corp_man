import { PlusIcon } from "@heroicons/react/24/solid";
import { AuthUser, StaticFunc } from "../../api/types";
import { Drawer } from "../../components/Drawer/Drawer";
import Button from "../../components/button/Button";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { useRegisterMember, useUpdateUserPermissions, useUpdateUserStatus } from "../../hooks/useApiHooks";
import { useUserStore } from "../../hooks/useUserStore";
import Checkbox from "../../components/form/input/Checkbox";
import ConfirmationModal from "../../components/confirm";
import { toast } from "react-toastify";
import { useAuthStore } from "../../hooks/useAuthStore";
import Badge from "../../components/ui/badge/Badge";

interface NewUserProps {
    user: AuthUser;
    isOpen: boolean;
    openModal: StaticFunc;
    closeModal: StaticFunc;
}

const NewUser = ({ user, isOpen, openModal, closeModal }: NewUserProps) => {
    const [openConfirm, setOpenConfrim] = useState<{ action?: "create" | "edit" | "status"; open: boolean }>({
        action: undefined,
        open: false
    });
    const [userData, setUserData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        password: "",
        permissions: []
    });

    const auth = useAuthStore((state) => state.user);

    const { permissions, getUserPermissions } = useUserStore((state) => state);

    useEffect(() => {
        getUserPermissions();
    }, []);

    useEffect(() => {
        if (user) {
            setUserData({
                email: user?.email,
                first_name: user?.first_name,
                last_name: user?.last_name,
                phone: user?.phone,
                password: "",
                permissions: user?.permissions
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const queryClient = useQueryClient();

    const { mutate: cm, isPending: cP } = useRegisterMember();

    const { mutate: um, isPending: uP } = useUpdateUserPermissions();

    const { mutate: sm, isPending: sP } = useUpdateUserStatus();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (user) {
            setOpenConfrim({ open: true, action: "edit" });
        } else {
            setOpenConfrim({ open: true, action: "create" });
        }
    };

    const isPending = uP || cP || sP;

    const close = () => {
        closeModal();
        setUserData({
            email: "",
            first_name: "",
            last_name: "",
            phone: "",
            password: "",
            permissions: []
        });
    };

    const handlePermissions = (permission: string) => {
        let permissions = [...userData.permissions];

        if (permissions.includes(permission)) {
            permissions = permissions.filter((p) => p !== permission);
        } else {
            permissions = [...permissions, permission];
        }

        setUserData((prev) => ({ ...prev, permissions }));
    };

    const resetForm = () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        closeModal();
        setUserData({
            email: "",
            first_name: "",
            last_name: "",
            phone: "",
            password: "",
            permissions: []
        });
    };

    const confirmAction = () => {
        setOpenConfrim((prev) => ({ ...prev, open: false }));

        if (openConfirm.action === "create") {
            cm(userData, {
                onSuccess() {
                    toast.success("Member created successfully. They will recieve an sms with their login details");
                    resetForm();
                },
                onError: (error) => {
                    toast.error(error.message);
                }
            });
            return;
        }
        if (openConfirm.action === "edit") {
            um(
                { userId: user?.uid, data: { permissions: userData.permissions } },
                {
                    onSuccess() {
                        toast.success("Member Permissions updated successfully");
                        resetForm();
                    },
                    onError: (error) => {
                        toast.error(error.message);
                    }
                }
            );
            return;
        }
        if (openConfirm.action === "status") {
            const status = user?.status === "active" ? "blocked" : "active";
            sm(
                { userId: user?.uid, data: { status } },
                {
                    onSuccess() {
                        toast.success("Member status updated successfully");
                        resetForm();
                    },
                    onError: (error) => {
                        toast.error(error.message);
                    }
                }
            );
            return;
        }
    };

    const allPermissions = Object.values(permissions)
        .flat()
        .map((perm) => perm.action);

    const handleSelectAll = (checked: boolean) => {
        // Flatten all permission actions from all sections

        setUserData((prev) => ({
            ...prev,
            permissions: checked ? allPermissions : []
        }));
    };

    const allSelected = allPermissions.length > 0 && allPermissions.every((perm) => userData.permissions.includes(perm));

    return (
        <>
            <div className="relative flex justify-between items-center flex-wrap mb-5">
                <Button onClick={openModal} variant="primary" leftIcon={<PlusIcon className="size-6" />} children="New User" />
            </div>
            <Drawer
                title={
                    <div className="">
                        <h2 className="text-lg font-semibold">{user ? "Edit" : "Add New"} User</h2>

                        {user && (
                            <div className="flex justify-end mb-3">
                                {user?.uid !== auth.uid && (
                                    <Button
                                        className="rounded-none"
                                        variant={user?.status === "active" ? "danger" : "success"}
                                        disabled={isPending}
                                        onClick={() => setOpenConfrim({ action: "status", open: true })}
                                    >
                                        {openConfirm.action === "status" && isPending && "Updating..."}
                                        {!isPending && user?.status === "active" && "Block staff"}
                                        {!isPending && user?.status === "blocked" && "Activate staff"}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                }
                isOpen={isOpen}
                onClose={close}
                position="right"
                width="w-full lg:w-1/2"
            >
                <form className="flex flex-col h-full" onSubmit={handleSubmit}>
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-3">
                        <div className="mt-7">
                            {!user ? (
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>First Name</Label>
                                        <Input
                                            type="text"
                                            name="first_name"
                                            value={userData.first_name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter first name"
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Last Name</Label>
                                        <Input
                                            type="text"
                                            name="last_name"
                                            value={userData.last_name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            value={userData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Phone</Label>
                                        <Input
                                            type="tel"
                                            name="phone"
                                            value={userData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Create Password</Label>
                                        <Input
                                            type="text"
                                            name="password"
                                            value={userData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter Password"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6 p-4 rounded-lg shadow-sm border bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                        <div className="flex justify-between items-center gap-4 mb-2">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Name</span>
                                                <span className="text-base font-semibold text-gray-800 dark:text-gray-100">
                                                    {userData.first_name} {userData.last_name}
                                                </span>
                                            </div>

                                            <Badge
                                                variant="light"
                                                children={user?.status}
                                                color={user?.status === "active" ? "success" : "error"}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email</span>
                                                <div className="text-sm text-gray-700 dark:text-gray-200">{userData.email}</div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Phone</span>
                                                <div className="text-sm text-gray-700 dark:text-gray-200">{userData.phone}</div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="mt-4">
                                <div className="w-full flex items-center">
                                    <Checkbox onChange={handleSelectAll} checked={allSelected} className="mx-1" />
                                    <Label className="block font-medium mt-2">
                                        {/* {user ? `${userData.first_name} ${userData.last_name}` : "Select"} Permissions */}
                                        Permissions
                                    </Label>
                                </div>
                                <div className="columns-1 md:columns-2 gap-4 space-y-4 w-full">
                                    {Object.entries(permissions).map(([section, items]) => (
                                        <div key={section} className="border p-4 rounded-lg shadow-sm">
                                            <h3 className="font-semibold mb-3 capitalize">{section}</h3>
                                            <div className="space-y-2">
                                                {items.map((perm) => (
                                                    <Checkbox
                                                        key={perm.action}
                                                        onChange={() => handlePermissions(perm.action)}
                                                        checked={userData.permissions.includes(perm.action)}
                                                        label={perm.name}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {user?.uid !== auth.uid && (
                        <div className="sticky bottom-2 left-0 flex items-center gap-3 px-2 mt-10 justify-end z-10">
                            <Button className="lg:w-full w-full" variant="primary" disabled={isPending}>
                                {user && !isPending && "Save Changes"}
                                {!user && !isPending && "Create User"}
                                {isPending && ["edit", "create"].includes(openConfirm.action) && "Saving..."}
                            </Button>
                        </div>
                    )}
                </form>
            </Drawer>
            <ConfirmationModal
                title={`Please Confirm`}
                isOpen={openConfirm.open}
                onCancel={() => setOpenConfrim({ open: false, action: undefined })}
                onConfirm={confirmAction}
            />
        </>
    );
};

export default NewUser;
