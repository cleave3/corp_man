import { useEffect, useState } from "react";
import { Business, UpdateBusinessPreferencesRequest } from "../../api/types";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { formatDate } from "../../utils/date";
import { useUpdateBusinessPreferences } from "../../hooks/useApiHooks";
import AccessWrapper from "../../components/AccessController";
import { PERMISSION_VALUES } from "../../utils";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Preferences = ({ data }: { data: Business["preferences"] }) => {
    const [form, setForm] = useState<UpdateBusinessPreferencesRequest>({
        sms_id: data?.sms_id,
        sms_notification: data?.sms_notification,
        email_notification: data?.email_notification,
        require_two_factor: data?.require_two_factor
    });
    const { openModal, closeModal, isOpen } = useModal();

    const { isPending, mutate } = useUpdateBusinessPreferences();

    useEffect(() => {
        setForm({
            sms_id: data?.sms_id,
            sms_notification: data?.sms_notification,
            email_notification: data?.email_notification,
            require_two_factor: data?.require_two_factor
        });
    }, [data]);

    const queryClient = useQueryClient();

    const updateForm = (field: keyof UpdateBusinessPreferencesRequest, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        mutate(form, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["business"] });
                toast.success("Business preference Updated successfully");
                closeModal();
            },
            onError: (error) => {
                toast.error(error.message);
            }
        });
    };
    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <span className="text-2xl font-semibold text-gray-600 dark:text-gray-300">Preferences</span>
                    </div>
                    <AccessWrapper componentPermissions={[PERMISSION_VALUES.business.update_business_preferences]}>
                        <button
                            onClick={openModal}
                            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                        >
                            <PencilIcon className="size-4" />
                            Edit
                        </button>
                    </AccessWrapper>
                </div>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between my-10">
                    <div>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">SMS SENDER ID</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{data?.sms_id}</p>
                            </div>
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">SMS Notification</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {data?.sms_notification ? "YES" : "NO"}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">EMAIL Notification</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {data?.email_notification ? "YES" : "NO"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Updated At</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {formatDate(data?.updated_at, "llll")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Edit Preferences</h4>
                    </div>
                    <form className="flex flex-col" onSubmit={handleSubmit}>
                        <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3">
                            <div className="mt-7">
                                <div className="col-span-1">
                                    <Label>SMS Sender ID</Label>
                                    <Input type="text" value={form?.sms_id || ""} onChange={(e) => updateForm("sms_id", e.target.value)} />
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
};

export default Preferences;
