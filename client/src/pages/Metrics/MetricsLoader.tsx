const MetricsLoader = () => {
    
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Column 1: Table Skeleton */}
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 animate-pulse">
                <div className="mb-4 h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr>
                                {[...Array(4)].map((_, i) => (
                                    <th key={i} className="px-4 py-2">
                                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(10)].map((_, rowIdx) => (
                                <tr key={rowIdx} className="border-b border-gray-200 dark:border-gray-700">
                                    {[...Array(4)].map((_, colIdx) => (
                                        <td key={colIdx} className="px-4 py-3">
                                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Column 2: Charts Skeleton */}
            <div className="flex flex-col gap-6">
                {/* Pie Chart Skeleton */}
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 animate-pulse flex flex-col items-center h-full">
                    <div className="h-48 w-48 bg-gray-200 dark:bg-gray-700 rounded-full mb-6"></div>
                    <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                {/* Bar Chart Skeleton */}
                {/* <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 animate-pulse">
                    <div className="flex items-end gap-2 h-32 mb-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded w-6" style={{ height: `${40 + i * 10}px` }}></div>
                        ))}
                    </div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div> */}
                {/* Line Chart Skeleton */}
                {/* <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 animate-pulse">
                    <div className="h-32 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 rounded mb-4"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div> */}
            </div>
        </div>
    );
};

export default MetricsLoader;
