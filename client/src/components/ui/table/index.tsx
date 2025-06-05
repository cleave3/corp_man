import { ReactNode } from "react";
import { StaticFunc } from "../../../api/types";

// Props for Table
interface TableProps {
    children: ReactNode; // Table content (thead, tbody, etc.)
    className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
    children: ReactNode; // Header row(s)
    className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
    children: ReactNode; // Body row(s)
    className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
    children: ReactNode; // Cells (th or td)
    className?: string; // Optional className for styling
    onClick?: StaticFunc;
}

// Props for TableCell
interface TableCellProps {
    children: ReactNode; // Cell content
    isHeader?: boolean; // If true, renders as <th>, otherwise <td>
    className?: string; // Optional className for styling
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
    return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
    return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
    return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className, ...props }) => {
    return (
        <tr className={`${props?.onClick ? "hover:bg-slate-100 cursor-pointer" : ""}${className}`} {...props}>
            {children}
        </tr>
    );
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({ children, isHeader = false, className }) => {
    const CellTag = isHeader ? "th" : "td";
    return (
        <CellTag
            className={`${
                isHeader
                    ? "px-5 py-3 font-extrabold text-gray-500 text-start text-theme-sm dark:text-gray-400"
                    : "px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
            } ${className}`}
        >
            {children}
        </CellTag>
    );
};

const TableLoader: React.FC<{ length?: number }> = ({ length = 8 }) => {
    return (
        <div className="p-8">
            <div className="animate-pulse">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <div className="min-w-[1102px]">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        {Array.from({ length: 6 }).map((_, idx) => (
                                            <th key={idx} className="px-5 py-3">
                                                <div className="h-4 bg-gray-200 rounded w-24" />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length }).map((_, rowIdx) => (
                                        <tr key={rowIdx} className="border-b border-gray-100 dark:border-white/[0.05]">
                                            {Array.from({ length: 6 }).map((_, colIdx) => (
                                                <td key={colIdx} className="px-5 py-4">
                                                    <div className="h-4 bg-gray-200 rounded w-full" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Pagination: React.FC<{ page: number; limit: number; total: number; loaded: number; nextFunc: StaticFunc; prevFunc: StaticFunc }> = ({
    limit,
    page,
    prevFunc,
    nextFunc,
    total,
    loaded
}) => {
    return (
        <div className="flex items-center justify-end gap-4 px-6 py-4">
            <div className="text-gray-500 text-theme-xs dark:text-gray-200">
                {total === 0 ? "No records" : `Showing ${loaded} of ${total}`}
            </div>
            <div className="flex items-center gap-2">
                <button
                    className="px-3 py-1 rounded border border-gray-200 bg-white text-gray-600 text-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
                    disabled={page === 1}
                    onClick={prevFunc}
                >
                    Previous
                </button>
                <span className="text-gray-500 text-theme-xs dark:text-gray-200">
                    Page {total === 0 ? 0 : page} of {Math.max(1, Math.ceil(total / limit))}
                </span>
                <button
                    className="px-3 py-1 rounded border border-gray-200 bg-white text-gray-600 text-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
                    disabled={page >= Math.ceil(total / limit) || total === 0}
                    onClick={nextFunc}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export { Table, TableHeader, TableBody, TableRow, TableCell, TableLoader, Pagination };
