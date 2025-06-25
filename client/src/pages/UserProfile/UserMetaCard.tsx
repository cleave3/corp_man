import { useAuthStore } from "../../hooks/useAuthStore";
import Badge from "../../components/ui/badge/Badge";
import { EyeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useModal } from "../../hooks/useModal";
import { useState } from "react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { Modal } from "../../components/ui/modal";
import { useChangePassword } from "../../hooks/useApiHooks";
import { toast } from "react-toastify";
import { EyeCloseIcon } from "../../icons";
import Button from "../../components/ui/button/Button";

export default function UserMetaCard() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ current_password: "", new_password: "" });

    const { openModal, closeModal, isOpen } = useModal();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const user = useAuthStore((state) => state.user);

    const { isPending, mutate } = useChangePassword();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        mutate(form, {
            onSuccess: () => {
                toast.success("Password changed successfully");
                closeModal();
                setForm({ current_password: "", new_password: "" });
            },
            onError: (error) => {
                toast.error(error.message);
            }
        });
    };

    if (!user) {
        return (
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 animate-pulse">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        <div className="order-3 xl:order-2 flex flex-col gap-2">
                            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="flex flex-col items-center gap-1 xl:flex-row xl:gap-3">
                                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                        </div>
                    </div>
                    <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
            </div>
        );
    }
    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                            {user?.image_url ? (
                                <img src={user.image_url} alt="user" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
                                    {`${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {user?.first_name} {user?.last_name}
                            </h4>
                            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <Badge
                                        variant="light"
                                        color={user?.status === "active" ? "success" : "error"}
                                        children={user?.status}
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={openModal}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto whitespace-nowrap"
                    >
                        <LockClosedIcon className="size-4" />
                        Change password
                    </button>
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Change Password</h4>
                    </div>
                    <form className="flex flex-col" onSubmit={handleSubmit}>
                        <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3">
                            <div className="mt-7">
                                <div>
                                    <Label>
                                        Current Password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            name="current_password"
                                            value={form.current_password}
                                            placeholder="Enter your current password"
                                            onChange={handleChange}
                                            required
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            ) : (
                                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5">
                                <Label>
                                    New Password <span className="text-error-500">*</span>{" "}
                                </Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        name="new_password"
                                        value={form.new_password}
                                        placeholder="Enter your new password"
                                        onChange={handleChange}
                                        required
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                    >
                                        {showPassword ? (
                                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                        ) : (
                                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 justify-end">
                            <Button size="sm" disabled={isPending} variant="outline" onClick={closeModal}>
                                Close
                            </Button>
                            <Button size="sm" disabled={isPending}>
                                {isPending ? "Saving Changes" : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
