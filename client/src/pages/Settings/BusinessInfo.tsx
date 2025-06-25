import { PencilIcon } from "@heroicons/react/24/solid";
import { Business, SubmitBusinessRequest } from "../../api/types";
import AccessWrapper from "../../components/AccessController";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useSubmitBusiness } from "../../hooks/useApiHooks";
import { useModal } from "../../hooks/useModal";
import { PERMISSION_VALUES } from "../../utils";
import { formatDate } from "../../utils/date";
import { useEffect, useState } from "react";

const BusinessInfo = ({ data }: { data: Business }) => {
    const [form, setForm] = useState<SubmitBusinessRequest>({
        business_address: data?.business_address,
        business_email: data?.business_email,
        business_name: data?.business_name,
        business_nature: data?.business_nature,
        business_phone: data?.business_phone,
        business_reg_no: data?.business_reg_no,
        business_type: data?.business_type,
        business_website: data?.business_website,
        certificate_url: data?.certificate_url,
        logo_url: data?.logo_url
    });

    const { openModal, closeModal, isOpen } = useModal();

    const { mutate, isPending, isSuccess } = useSubmitBusiness();

    useEffect(() => {
        setForm({
            business_address: data?.business_address,
            business_email: data?.business_email,
            business_name: data?.business_name,
            business_nature: data?.business_nature,
            business_phone: data?.business_phone,
            business_reg_no: data?.business_reg_no,
            business_type: data?.business_type,
            business_website: data?.business_website,
            certificate_url: data?.certificate_url,
            logo_url: data?.logo_url
        });
    }, [data]);

    useEffect(() => {
        if (isSuccess) closeModal();
    }, [closeModal, isSuccess]);

    const updateForm = (field: keyof Business, value: string) => {
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
                        <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                            {data?.logo_url ? (
                                <img src={data?.logo_url} alt="user" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
                                    {`${data?.business_name?.[0] ?? ""} ${data?.business_name?.[1] ?? ""}`.toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {data?.business_name}
                            </h4>
                            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <Badge
                                        variant="light"
                                        color={data?.business_kyc_status === "approved" ? "success" : "warning"}
                                        children={data?.business_kyc_status}
                                    />
                                </p>
                            </div>
                        </div>
                    </div>

                    <AccessWrapper componentPermissions={[PERMISSION_VALUES.business.update_business]}>
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
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">REG. Number</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{data?.business_reg_no}</p>
                            </div>
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Nature of Business</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{data?.business_nature}</p>
                            </div>
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Business Type</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{data?.business_type}</p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Address</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{data?.business_address}</p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email address</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{data?.business_email}</p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Phone</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{data?.business_phone}</p>
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
                        <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">Edit Business Information</h4>
                    </div>
                    <form className="flex flex-col" onSubmit={handleSubmit}>
                        <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3">
                            <div className="mt-7">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Business Name</Label>
                                        <Input
                                            type="text"
                                            value={form.business_name || ""}
                                            onChange={(e) => updateForm("business_name", e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Registration Number</Label>
                                        <Input
                                            type="text"
                                            value={form.business_reg_no || ""}
                                            onChange={(e) => updateForm("business_reg_no", e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Email Address</Label>
                                        <Input
                                            type="email"
                                            value={form.business_email || ""}
                                            onChange={(e) => updateForm("business_email", e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Phone</Label>
                                        <Input
                                            type="text"
                                            value={form.business_phone || ""}
                                            onChange={(e) => updateForm("business_phone", e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Nature of Business</Label>
                                        <Input
                                            type="text"
                                            value={form.business_nature || ""}
                                            onChange={(e) => updateForm("business_nature", e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Business Type</Label>
                                        <Input
                                            type="text"
                                            value={form.business_type || ""}
                                            onChange={(e) => updateForm("business_type", e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Label>Business Address</Label>
                                        <Input
                                            value={form.business_address || ""}
                                            onChange={(e) => updateForm("business_address", e.target.value)}
                                        />
                                    </div>

                                    {/* <div className="col-span-2">
                                        <Label>Business Website</Label>
                                        <Input
                                            type="text"
                                            value={form.business_website || ""}
                                            onChange={(e) => updateForm("business_website", e.target.value)}
                                        />
                                    </div> */}
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

export default BusinessInfo;
