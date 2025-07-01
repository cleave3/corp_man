import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);

export const dateInputFormat = (date?: string | Date) => {
    return dayjs(date ? new Date(date as string) : undefined);
};

export const dayDiff = (date2: string | Date = currentDate(), date1: string | Date = currentDate()) => {
    return dayjs(new Date(date1)).diff(new Date(date2), "day");
};

export const hoursDiff = (date2: string | Date = currentDate(), date1: string | Date = currentDate()) => {
    return dayjs(new Date(date1)).diff(new Date(date2), "hours");
};

export const yearsDiff = (date2: string | Date = currentDate(), date1: string | Date = currentDate()) => {
    return dayjs(new Date(date1)).diff(new Date(date2), "years");
};

export const daysBefore = (numberOfDays: number) => {
    const currentdate = new Date();
    return new Date(currentdate.setDate(currentdate.getDate() - numberOfDays)).toISOString();
};

export const daysAfter = (numberOfDays: number, refDate: string | Date = currentDate()) => {
    const currentdate = new Date(refDate);
    return new Date(currentdate.setDate(currentdate.getDate() + numberOfDays)).toISOString();
};

export const currentDate = () => {
    return new Date().toISOString();
};

export const firstDayOfWeek = () => {
    const date = new Date();

    return new Date(date.setDate(date.getDate() - date.getDay())).toISOString();
};

export const firstDayOfMonth = () => {
    const date = new Date();

    return new Date(`${date.getFullYear()}-${date.getMonth() + 1}-01`).toISOString();
};

export const firstDayOfYear = () => {
    const date = new Date();

    return new Date(`${date.getFullYear()}-01-01`).toISOString();
};

export const dateFromNow = (date: string) => {
    if (!date) return "N/A";
    return dayjs(date).fromNow();
};

export const formatDate = (date?: string, format: string = "ll") => {
    return date ? dayjs(date).format(format) : "N/A";
};