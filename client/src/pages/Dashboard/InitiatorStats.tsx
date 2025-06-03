import { Table, TableHeader, TableRow, TableCell, TableBody } from "../../components/ui/table";
import { useTransactionsByInitiator } from "../../hooks/useApiHooks";
import { formatNumber } from "../../utils";

const InitiatorStats = () => {
    const { data, isLoading } = useTransactionsByInitiator();

    const initiators = data?.data;

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Top Collectors</h3>
                </div>
            </div>
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                        <TableRow>
                            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                #
                            </TableCell>
                            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                User
                            </TableCell>
                            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Collections
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {isLoading && (
                            <div className="flex justify-center items-center h-24">
                                <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></span>
                            </div>
                        )}
                        {initiators?.map((initiator, i) => (
                            <TableRow key={initiator?.initiator_id} className="">
                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{i + 1}</TableCell>
                                <TableCell className="py-3">{initiator?.name}</TableCell>
                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {formatNumber(initiator?.count)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default InitiatorStats;
