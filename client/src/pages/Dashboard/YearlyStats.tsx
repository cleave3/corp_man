import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTransactionYearStats } from "../../hooks/useApiHooks";
import { formatCurrency } from "../../utils";
import { useState } from "react";

export default function MonthlyTransactionChart() {
    const [year, setYear] = useState(new Date().getFullYear());

    const { data, isLoading } = useTransactionYearStats(year?.toString());

    const options: ApexOptions = {
        colors: ["#465fff"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "bar",
            height: 180,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "39%",
                borderRadius: 5,
                borderRadiusApplication: "end"
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 4,
            colors: ["transparent"]
        },
        xaxis: {
            categories: data?.data?.map((d) => d.month),
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "left",
            fontFamily: "Outfit"
        },
        yaxis: {
            title: {
                text: undefined
            }
        },
        grid: {
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        fill: {
            opacity: 1
        },

        tooltip: {
            x: {
                show: false
            },
            y: {
                formatter: (val: number) => formatCurrency(val)
            }
        }
    };
    const series = [
        {
            name: "Collections",
            data: data?.data?.map((d) => d.amount)
        }
    ];

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Collection</h3>
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

            <div className="max-w-full overflow-x-auto custom-scrollbar">
                {isLoading ? (
                    <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
                        <div className="h-[180px] w-full bg-gray-100 animate-pulse rounded-md" />
                    </div>
                ) : (
                    <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
                        <Chart options={options} series={series} type="bar" height={400} />
                    </div>
                )}
            </div>
        </div>
    );
}
