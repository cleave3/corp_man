import { useState } from "react";
import { useCreateCustomer, useUpdateCustomer } from "../../hooks/useApiHooks";
import { toast } from "react-toastify";
import CurrencyInput from "../../components/form/input/CurrencyInput";
import Label from "../../components/form/Label";
import SearchableSelect from "../../components/form/SearchableSelect";
import { currentDate } from "../../utils/date";
import Input from "../../components/form/input/InputField";
import { useQueryClient } from "@tanstack/react-query";
import { Customer, StaticFunc, UpdateCustomerRequest } from "../../api/types";
import { useEffect } from "react";
import Button from "../../components/button/Button";

const NewCustomer = ({ closeModal, customerToEdit }: { closeModal: StaticFunc; customerToEdit: Customer }) => {
    const [customer, setCustomer] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        sms_alert: "YES",
        customer_type: "regular",
        customer_code: "",
        payment_frequency: "weekly",
        next_payment_date: currentDate(),
        opening_balance: 0
    });

    const { mutate: cm, isPending: cP } = useCreateCustomer();

    const { mutate: um, isPending: uP } = useUpdateCustomer();

    useEffect(() => {
        if (customerToEdit) {
            setCustomer({
                first_name: customerToEdit.first_name || "",
                last_name: customerToEdit.last_name || "",
                email: customerToEdit.email || "",
                phone: customerToEdit.phone || "",
                address: customerToEdit.address || "",
                payment_frequency: customerToEdit.payment_frequency || "weekly",
                next_payment_date: customerToEdit.next_payment_date?.substring(0, 10) || currentDate(),
                opening_balance: 0,
                customer_code: customerToEdit?.customer_code || "",
                customer_type: customerToEdit?.customer_type || "regular",
                sms_alert: customerToEdit?.sms_alert || "YES"
            });
        }
    }, [customerToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({
            ...prev,
            [name]: name === "customer_code" ? value?.toUpperCase() : value
        }));
    };

    const queryClient = useQueryClient();

    const resetForm = () => {
        setCustomer({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            address: "",
            payment_frequency: "",
            next_payment_date: "",
            opening_balance: 0,
            customer_code: "",
            customer_type: "regular",
            sms_alert: "YES"
        });
        closeModal();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (customerToEdit) {
            const editCustomerData: UpdateCustomerRequest = {
                first_name: customer.first_name,
                last_name: customer.last_name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                payment_frequency: customer.payment_frequency,
                customer_code: customer.customer_code,
                customer_type: customer.customer_type,
                next_payment_date: customer.next_payment_date,
                sms_alert: customer.sms_alert,
            };
            um(
                { customerId: customerToEdit.id, data: editCustomerData },
                {
                    onSuccess: async (data) => {
                        queryClient.invalidateQueries({ queryKey: ["customers"] });
                        toast.success(data.message);
                        resetForm();
                    },
                    onError: (error) => {
                        toast.error(error.message);
                    }
                }
            );
        } else {
            cm(customer, {
                onSuccess: async (data) => {
                    queryClient.invalidateQueries({ queryKey: ["customers"] });
                    toast.success(data.message);
                    resetForm();
                },
                onError: (error) => {
                    toast.error(error.message);
                }
            });
        }
    };

    const isPending = uP || cP;

    return (
        <div className="p-7 pt-10">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">{customerToEdit ? "Edit Customer" : "New Customer"}</h2>
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="custom-scrollbar h-auto  px-2 pb-3">
                    <div className="mt-7">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                            <div className="col-span-2 lg:col-span-1">
                                <Label>First Name</Label>
                                <Input
                                    type="text"
                                    name="first_name"
                                    value={customer.first_name}
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
                                    value={customer.last_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter last name"
                                />
                            </div>

                            <div className="col-span-2 lg:col-span-1">
                                <Label>Customer Code</Label>
                                <Input
                                    type="text"
                                    name="customer_code"
                                    value={customer.customer_code}
                                    onChange={handleChange}
                                    maxLength={20}
                                    required
                                    placeholder="Enter customer code"
                                />
                            </div>
                            <div className="col-span-2 lg:col-span-1">
                                <Label>Customer type</Label>
                                <SearchableSelect
                                    placeholder="Select customer type"
                                    value={customer.customer_type}
                                    onChange={(value) => setCustomer((prev) => ({ ...prev, customer_type: value }))}
                                    options={[
                                        { label: "Regular", value: "regular" },
                                        { label: "Premium", value: "premium" }
                                    ]}
                                />
                            </div>
                            <div className="col-span-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={customer.email}
                                    onChange={handleChange}
                                    // required
                                    placeholder="Enter email address"
                                />
                            </div>
                            <div className="col-span-2 lg:col-span-1">
                                <Label>Phone</Label>
                                <Input
                                    type="tel"
                                    name="phone"
                                    value={customer.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div className="col-span-2 lg:col-span-1">
                                <Label>Payment Frequency</Label>
                                <SearchableSelect
                                    placeholder="Select payment frequency"
                                    value={customer.payment_frequency}
                                    onChange={(value) => setCustomer((prev) => ({ ...prev, payment_frequency: value }))}
                                    options={[
                                        { label: "Daily", value: "daily" },
                                        { label: "Weekly", value: "weekly" },
                                        { label: "Biweekly", value: "biweekly" },
                                        { label: "Monthly", value: "monthly" },
                                        { label: "Yearly", value: "yearly" }
                                    ]}
                                />
                            </div>
                            <div className="col-span-2 lg:col-span-1">
                                <Label>Next Payment Date</Label>
                                <Input
                                    className="input"
                                    type="date"
                                    name="next_payment_date"
                                    value={customer.next_payment_date}
                                    onChange={handleChange}
                                    required
                                    placeholder="Select next payment date"
                                />
                            </div>
                            {!customerToEdit && (
                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Opening Balance</Label>
                                    <CurrencyInput
                                        required
                                        name="opening_balance"
                                        value={customer.opening_balance}
                                        onChange={(value) => setCustomer((prev) => ({ ...prev, opening_balance: value }))}
                                        placeholder="Enter opening balance"
                                    />
                                </div>
                            )}
                            <div className="col-span-2 lg:col-span-1">
                                <Label>SMS Alert Settings</Label>
                                <SearchableSelect
                                    placeholder="Select Alert Settings"
                                    value={customer.sms_alert}
                                    onChange={(value) => setCustomer((prev) => ({ ...prev, sms_alert: value }))}
                                    options={[
                                        { label: "YES", value: "YES" },
                                        { label: "NO", value: "NO" }
                                    ]}
                                />
                            </div>
                            <div className="col-span-2">
                                <Label>Address</Label>
                                <Input
                                    type="text"
                                    name="address"
                                    value={customer.address}
                                    onChange={handleChange}
                                    placeholder="Enter address"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-2 mt-10 justify-end">
                    <Button className="lg:w-full w-full" variant="primary" disabled={isPending}>
                        {isPending ? "Saving Customer" : "Save Customer"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default NewCustomer;
