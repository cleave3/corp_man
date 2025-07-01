import { Transaction } from "../../api/types";
import Badge from "../../components/ui/badge/Badge";
import { formatCurrency } from "../../utils";
import { formatDate } from "../../utils/date";

const RecieptItem = ({ label, value }) => {
    return (
        <div>
            <span className="block text-xs text-gray-500 dark:text-gray-400">{label}</span>
            <span className="block text-gray-700 dark:text-gray-200">{value ?? "-"}</span>
        </div>
    );
};

const TransactionDetail = ({ selectedTransaction }: { selectedTransaction: Transaction }) => {
    return (
        <div className="px-5 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 mt-10 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Transaction Receipt</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">#{selectedTransaction.id}</p>
                    <div className="my-2">
                        <span className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
                            {formatCurrency(selectedTransaction.amount)}
                        </span>
                        <Badge
                            variant="light"
                            color={
                                selectedTransaction.status === "completed"
                                    ? "success"
                                    : selectedTransaction.status === "pending"
                                    ? "warning"
                                    : "error"
                            }
                        >
                            {selectedTransaction.status}
                        </Badge>
                    </div>
                </div>
            </div>
            <div className="border-t border-b border-dashed border-gray-300 dark:border-gray-700 py-6 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RecieptItem label="Type" value={selectedTransaction.transaction_type} />
                    <RecieptItem label="Description" value={selectedTransaction.description} />
                    <RecieptItem label="Initiator" value={selectedTransaction.initiator?.name} />
                    <RecieptItem label="Approver" value={selectedTransaction?.approvers?.[0]?.approver?.name ?? "-"} />
                    <RecieptItem label="Created At" value={formatDate(selectedTransaction.created_at, "llll")} />
                    <RecieptItem label="Updated At" value={formatDate(selectedTransaction.updated_at, "llll")} />
                    <RecieptItem label="Updated By" value={selectedTransaction.updated_by?.name ?? "-"} />
                    <RecieptItem label="Requires Approval" value={selectedTransaction.requires_approval ? "Yes" : "No"} />
                    <RecieptItem label="# of Required Approvals" value={selectedTransaction.number_of_required_approval} />
                    <RecieptItem label="Business ID" value={selectedTransaction.business_id} />
                    <RecieptItem label="Customer ID" value={selectedTransaction.meta_data?.customer_id} />
                </div>
            </div>
        </div>
    );
};

export default TransactionDetail;
