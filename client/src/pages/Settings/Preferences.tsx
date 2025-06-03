import { useEffect, useState } from "react";
import { Business, UpdateBusinessPreferencesRequest } from "../../api/types";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { formatDate } from "../../utils/date";
import { useUpdateBusinessPreferences } from "../../hooks/useApiHooks";

const Preferences = ({ data }: { data: Business["preferences"] }) => {
    const [form, setForm] = useState<UpdateBusinessPreferencesRequest>({
        sms_id: data?.sms_id,
        sms_notification: data?.sms_notification,
        email_notification: data?.email_notification,
        require_two_factor: data?.require_two_factor
    });
    const { openModal, closeModal, isOpen } = useModal();

    const { isPending, isSuccess, mutate } = useUpdateBusinessPreferences();

    useEffect(() => {
        setForm({
            sms_id: data?.sms_id,
            sms_notification: data?.sms_notification,
            email_notification: data?.email_notification,
            require_two_factor: data?.require_two_factor
        });
    }, [data]);

    useEffect(() => {
        if (isSuccess) closeModal();
    }, [closeModal, isSuccess]);

    const updateForm = (field: keyof UpdateBusinessPreferencesRequest, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        mutate(form);
    };
    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <span className="text-2xl font-semibold text-gray-600 dark:text-gray-300">Preferences</span>
                    </div>
                    <button
                        onClick={openModal}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    >
                        <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                fill=""
                            />
                        </svg>
                        Edit
                    </button>
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
