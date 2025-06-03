export const PERMISSION_VALUES = {
    dashboard_overview: "dashboard.overview",
    dashboard_revenue: "dashboard.revenue",
    dashboard_target: "dashboard.target",
    dashboard_due_payments: "dashboard.due_payments",
    dashboard_notifications: "dashboard.notifications",
    dashboard_pending: "dashboard.pending",
    view_users: "user.view",
    update_user: "user.update",
    create_user: "user.create",
    delete_user: "user.delete",
    view_customers: "customer.view",
    update_customers: "customer.update",
    create_customers: "customer.create",
    delete_customers: "customer.delete",
    view_balances: "customer.view_balances",
    update_business: "business.update",
    view_business: "business.view",
    update_business_preferences: "business.update_preferences",
    view_transactions: "transaction.view",
    initiate_transaction: "transaction.initiate",
    modify_transaction: "transaction.modify",
    approve_transaction: "transaction.approve",
    view_settings: "settings.view",
    modify_settings: "settings.modify"
};

export const ROUTES = {
    DASHBOARD: "/",
    SIGNIN: "/signin",
    FORGOT_PASSWORD: "/reset-password",
    CUSTOMERS: "/customers",
    TRANSACTIONS: "/transactions",
    PROFILE: "/profile",
    SETTINGS: "/settings",
    USERS: "/users"
};

export const formatCurrency = (value: number, currency = "₦") => {
    return `${currency} ${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`;
};

export const formatCurrencyShort = (value: number = 0, currency = "₦") => {
    const absValue = Math.abs(value);
    let formatted = "";
    if (absValue >= 1e12) {
        formatted = (value / 1e12).toFixed(2).replace(/\.00$/, "") + "T";
    } else if (absValue >= 1e9) {
        formatted = (value / 1e9).toFixed(2).replace(/\.00$/, "") + "B";
    } else if (absValue >= 1e6) {
        formatted = (value / 1e6).toFixed(2).replace(/\.00$/, "") + "M";
    } else if (absValue >= 1e3) {
        formatted = (value / 1e3).toFixed(2).replace(/\.00$/, "") + "K";
    } else {
        formatted = value.toFixed(2).replace(/\.00$/, "");
    }
    return `${currency} ${formatted}`;
};

export const formatNumber = (value: number | string) => {
    return new Intl.NumberFormat().format(Number(value));
};
