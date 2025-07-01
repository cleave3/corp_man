import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useState } from "react";
import { useCreateTransaction, useGetAllCustomers } from "../../hooks/useApiHooks";
import { CreateTransactionRequest } from "../../api/types";
import CurrencyInput from "../../components/form/input/CurrencyInput";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import TextArea from "../../components/form/input/TextArea";
import SearchableSelect from "../../components/form/SearchableSelect";
import { toast } from "react-toastify";
import Input from "../../components/form/input/InputField";
import { useModal } from "../../hooks/useModal";
import ConfirmationModal from "../../components/confirm";

const NewTransaction = () => {
    const [transaction, setTransaction] = useState<CreateTransactionRequest>({
        amount: 0,
        transaction_type: "customer_deposit",
        description: "",
        meta_data: {}
    });

    const { isOpen, openModal, closeModal } = useModal();

    const { mutate, isPending } = useCreateTransaction();

    const { data } = useGetAllCustomers();

    const handleTransactionChange = (field: string, value: string | number) => {
        setTransaction((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (transaction.transaction_type !== "income" && !transaction?.meta_data?.customer_id) {
            toast.warning("Please select a customer");
            return;
        }

        openModal();
    };

    const handleConfirmAction = () => {
        if (transaction.transaction_type !== "income") {
            const customer = data?.data?.find?.((c) => c.id === transaction?.meta_data?.customer_id);
            transaction.meta_data.customer = customer.name;
        }

        closeModal();

        mutate(transaction, {
            onSuccess: async (data) => {
                toast.success(data.message);
                setTransaction({
                    amount: 0,
                    transaction_type: "",
                    description: "",
                    meta_data: {}
                });
            },
            onError: (error) => {
                toast.error(error.message);
            }
        });
    };

    return (
        <>
            <PageBreadcrumb pageTitle={`Add Transaction`} />
            <div>
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3">
                        <div className="mt-7">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Amount</Label>
                                    <CurrencyInput
                                        required
                                        value={transaction.amount}
                                        onChange={(e) => handleTransactionChange("amount", e)}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Transaction Type</Label>
                                    <SearchableSelect
                                        placeholder="Select Transaction Type"
                                        value={transaction?.transaction_type}
                                        options={[
                                            { label: "Customer Deposit", value: "customer_deposit" },
                                            { label: "Payout", value: "payout" },
                                            { label: "Income", value: "income" }
                                        ].map((c) => ({
                                            value: c.value,
                                            label: c.label
                                        }))}
                                        onChange={(value) => {
                                            if (value === "income") {
                                                setTransaction((prev) => ({
                                                    ...prev,
                                                    transaction_type: value,
                                                    meta_data: {}
                                                }));
                                            } else {
                                                setTransaction((prev) => ({
                                                    ...prev,
                                                    transaction_type: value
                                                }));
                                            }
                                        }}
                                    />
                                </div>

                                {transaction?.transaction_type !== "income" && (
                                    <>
                                        <div className="col-span-2 lg:col-span-1">
                                            <Label>Customer</Label>
                                            <SearchableSelect
                                                placeholder="Select Customer"
                                                value={transaction?.meta_data?.customer_id}
                                                options={(data?.data || [])?.map((c) => ({
                                                    value: c.id,
                                                    label: `${c.name} [${c.customer_code}] - (${c.phone})` // [${formatCurrency(c.balance)}]`
                                                }))}
                                                onChange={(value) =>
                                                    setTransaction((prev) => ({
                                                        ...prev,
                                                        meta_data: {
                                                            customer_id: value
                                                        }
                                                    }))
                                                }
                                            />
                                        </div>

                                        <div className="col-span-2 lg:col-span-1">
                                            <Label>Next Payment Date</Label>
                                            <Input
                                                placeholder="Start Date"
                                                type="date"
                                                value={transaction?.meta_data?.next_payment_date}
                                                onChange={(e) =>
                                                    setTransaction((prev) => ({
                                                        ...prev,
                                                        meta_data: {
                                                            ...prev.meta_data,
                                                            next_payment_date: e.target.value
                                                        }
                                                    }))
                                                }
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="col-span-2">
                                    <Label>Description</Label>
                                    <TextArea
                                        value={transaction.description}
                                        onChange={(e) => handleTransactionChange("description", e)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-2 mt-6 justify-end">
                        <Button size="sm" disabled={isPending}>
                            {isPending ? "Saving Transaction" : "Save Transaction"}
                        </Button>
                    </div>
                </form>
            </div>
            <ConfirmationModal
                title={`Are you sure you want to submit this transaction?`}
                isOpen={isOpen}
                onCancel={closeModal}
                onConfirm={handleConfirmAction}
            />
        </>
    );
};

export default NewTransaction;
