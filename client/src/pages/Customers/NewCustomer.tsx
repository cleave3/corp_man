import { useState } from "react";
import { useCreateCustomer, useUpdateCustomer } from "../../hooks/useApiHooks";
import { toast } from "react-toastify";
import CurrencyInput from "../../components/form/input/CurrencyInput";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import SearchableSelect from "../../components/form/SearchableSelect";
import { currentDate } from "../../utils/date";
import Input from "../../components/form/input/InputField";
import { useQueryClient } from "@tanstack/react-query";
import { Customer, StaticFunc, UpdateCustomerRequest } from "../../api/types";
import { useEffect } from "react";

const NewCustomer = ({ closeModal, customerToEdit }: { closeModal: StaticFunc; customerToEdit: Customer }) => {
    const [customer, setCustomer] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
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
                opening_balance: 0
            });
        }
    }, [customerToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const queryClient = useQueryClient();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (customerToEdit) {
            const editCustomerData: UpdateCustomerRequest = {
                first_name: customer.first_name,
                last_name: customer.last_name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                payment_frequency: customer.payment_frequency
            };
            um(
                { customerId: customerToEdit.id, data: editCustomerData },
                {
                    onSuccess: async (data) => {
                        queryClient.invalidateQueries({ queryKey: ["customers"] });
                        toast.success(data.message);

                        setCustomer({
                            first_name: "",
                            last_name: "",
                            email: "",
                            phone: "",
                            address: "",
                            payment_frequency: "",
                            next_payment_date: "",
                            opening_balance: 0
                        });
                        closeModal();
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

                    setCustomer({
                        first_name: "",
                        last_name: "",
                        email: "",
                        phone: "",
                        address: "",
                        payment_frequency: "",
                        next_payment_date: "",
                        opening_balance: 0
                    });
                    closeModal();
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
                            <div className="col-span-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={customer.email}
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
                                        { label: "Weekly", value: "weekly" },
                                        { label: "Biweekly", value: "biweekly" },
                                        { label: "Monthly", value: "monthly" }
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
                    <Button size="sm" disabled={isPending}>
                        {isPending ? "Saving Customer" : "Save Customer"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default NewCustomer;
