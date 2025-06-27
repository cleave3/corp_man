import Chart from "react-apexcharts";
import { useTransactionsByInitiator } from "../../hooks/useApiHooks";
import InitiatorStats from "./InitiatorStats";
import MetricsLoader from "./MetricsLoader";
import { useState } from "react";
import { formatCurrency } from "../../utils";
import useWidth from "../../hooks/useWidth";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const Metrics = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    const { isMobile } = useWidth()

    const { data, isLoading } = useTransactionsByInitiator(year, month);

    const initiators = data?.data?.collectors_stats;
    const total_customer_deposits = data?.data?.total_customer_deposits;
    const total_income = data?.data?.total_income;
    const total_payouts = data?.data?.total_payouts;

    if (isLoading) return <MetricsLoader />;

    return (
        <>
            <h2
                className="text-2xl font-semibold text-center my-4
                    text-gray-900 dark:text-white"
            >
                Performance for metrics for {months[month - 1]} {year}
            </h2>
            <div className="flex items-center justify-start gap-2">
                <select
                    className="h-11 w-50 appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ml-4"
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                >
                    {months.map((monthName, idx) => {
                        // Only show months up to the current month if the selected year is the current year
                        const isCurrentYear = year === new Date().getFullYear();
                        const maxMonth = isCurrentYear ? new Date().getMonth() + 1 : 12;
                        if (idx + 1 > maxMonth) return null;
                        return (
                            <option key={idx + 1} value={idx + 1}>
                                {monthName}
                            </option>
                        );
                    })}
                </select>
                <select
                    className="h-11 w-50 appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                >
                    {Array.from({ length: new Date().getFullYear() - 2023 }, (_, i) => (
                        <option key={i} value={new Date().getFullYear() - i}>
                            {new Date().getFullYear() - i}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="flex flex-col my-6">
                    {total_customer_deposits || total_income || total_payouts ? (
                        <Chart
                            type="pie"
                            height={400}
                            series={[total_customer_deposits || 0, total_income || 0, total_payouts || 0]}
                            options={{
                                labels: ["Total Customer Deposits", "Total Income", "Total Payouts"],
                                legend: {
                                    position: isMobile ? "top" : "left",

                                    formatter: (seriesName: string, opts) => {
                                        const value = opts.w.globals.series[opts.seriesIndex];
                                        return `${seriesName}: ${formatCurrency(value)}`;
                                    }
                                },
                                title: { text: "Financial Flow Breakdown", align: "center" },
                                tooltip: {
                                    y: {
                                        formatter: (val: number) => formatCurrency(val)
                                    }
                                }
                            }}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                            <span className="text-lg">No financial data available for this period.</span>
                        </div>
                    )}
                    <div className="mt-6">
                        {initiators && initiators.length > 0 ? (
                            <Chart
                                type="bar"
                                height={400}
                                series={[
                                    {
                                        name: "Collection Volume",
                                        data: initiators?.map((i) => i.collection_volume) || []
                                    }
                                ]}
                                options={{
                                    chart: { id: "initiator-collection-volume" },
                                    xaxis: {
                                        categories: initiators?.map((i) => i.name) || [],
                                        title: { text: "Collectors name" }
                                    },
                                    yaxis: {
                                        title: { text: "Amount Collected" },
                                        labels: {
                                            formatter: (val: number) => formatCurrency(val)
                                        }
                                    },
                                    title: {
                                        text: "Collections Stats",
                                        align: "center"
                                    },
                                    legend: {
                                        show: true,
                                        formatter: (seriesName: string) => `Collection Volume (${seriesName})`
                                    },
                                    tooltip: {
                                        y: {
                                            formatter: (val: number) => formatCurrency(val)
                                        }
                                    }
                                }}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                                <span className="text-lg">No collection stats available for this period.</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="order-first lg:order-none lg:p-6 my-6">
                    <InitiatorStats initiators={initiators} />
                </div>
            </div>
        </>
    );
};

export default Metrics;
