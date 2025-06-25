import { JSX } from "react";

export type StaticFunc = () => void;

export interface APIResponse<T = null> {
    status: boolean;
    code: number;
    message: string;
    data: T;
    error: string;
}

export type PaginatedResponsePayload<T = null, K extends string = "data"> = {
    status: boolean;
    code: number;
    message: string;
    data: {
        error: string;
        page: number;
        limit: number;
        total: number;
    } & { [key in K]: T };
};

export interface AppCustomRouteProps {
    children: JSX.Element;
    componentPermissions?: string[];
}

export interface LoginUserRequest {
    email: string;
    password: string;
}

export interface SocioAuthRequest {
    email: string;
    id_token: string;
}

export interface RegisterMemberRequest {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    password: string;
    permissions: string[];
}

export interface ResendVerificationRequest {
    email: string;
    channel: "email" | "phone";
}

export interface ChangePasswordRequest {
    current_password: string;
    new_password: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface UpdateStatusRequest {
    status: "blocked" | "active";
}

export interface UpdatePermissionsRequest {
    permissions: string[];
}

export interface SubmitBusinessRequest {
    business_address: string;
    business_email: string;
    business_name: string;
    business_nature: string;
    business_phone: string;
    business_reg_no: string;
    business_type: string;
    business_website: string;
    certificate_url: string;
    logo_url: string;
}

export interface UpdateBusinessPreferencesRequest {
    email_notification: boolean;
    require_two_factor: boolean;
    sms_id: string;
    sms_notification: boolean;
}

export interface CreateCustomerRequest {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    image_url?: string;
    address: string;
    customer_type: string;
    customer_code: string;
    payment_frequency: string;
    next_payment_date: string;
    opening_balance: number;
}

export type UpdateCustomerRequest = Partial<Omit<CreateCustomerRequest, "opening_balance">>;

export interface CreateTransactionRequest {
    amount: number;
    transaction_type: string;
    description: string;
    meta_data?: {
        [x: string]: string;
    };
}

export interface PaginatedQuery {
    status?: string;
    page?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
    search?: string;
    [x: string]: PropertyKey;
}

export type SignInResponseData = {
    access_token: string;
    refresh_token: string;
    user: {
        uid: string;
    };
};

export type Auth = {
    uid: string;
    phone: string;
    user_type: "user" | "staff";
    status: "active" | "blocked";
    two_factor_enabled: boolean;
    has_password: boolean;
    last_login: string;
    name: string;
    business_id: string;
    email: string;
    is_email_verified: boolean;
    is_phone_verified: boolean;
    two_factor_option: string;
};

export type AuthUser = {
    uid: string;
    phone: string;
    last_name: string;
    permissions: string[];
    updated_at: string;
    business_id: string;
    email: string;
    first_name: string;
    image_url?: string;
    created_at: string;
    user_type: "user" | "staff";
    status: "active" | "blocked";
    two_factor_enabled: boolean;
    has_password: boolean;
    last_login: string;
    name: string;
    is_email_verified: boolean;
    is_phone_verified: boolean;
    two_factor_option: "none" | "email" | "authenticator";
};

export type Business = {
    business_name: string;
    business_address: string;
    business_email: string;
    business_type: string;
    business_website: string;
    certificate_url: string;
    business_kyc_status: string;
    updated_at: string;
    id: string;
    business_phone: string;
    logo_url: string;
    business_nature: string;
    business_reg_no: string;
    modules: string[];
    created_at: string;
    preferences: {
        id: string;
        sms_id: string;
        require_two_factor: boolean;
        updated_at: string;
        sms_notification: boolean;
        business_id: string;
        email_notification: boolean;
        created_at: string;
    };
};

export type Customer = {
    id: string;
    business_id: string;
    last_name: string;
    phone: string;
    address: string;
    next_payment_date: string;
    updated_at: string;
    first_name: string;
    email: string;
    image_url: string;
    payment_frequency: string;
    customer_type: string;
    customer_code: string;
    created_at: string;
    creator_id: string;
    creator: {
        name: string;
    };
    balance: number;
};

export type Transaction = {
    business_id: string;
    amount: number;
    status: "cancelled" | "completed" | "pending";
    meta_data: {
        [x: string]: string;
        // customer_id: string;
    };
    number_of_required_approval: number;
    updated_at: string;
    updated_by_id: string;
    id: string;
    transaction_type: "customer_deposit" | "payout" | "income";
    description: string;
    requires_approval: boolean;
    created_at: string;
    initiator_id: string;
    initiator: {
        name: string;
    };
    approvers: {
        user_id: string;
        id: string;
        transaction_id: string;
        created_at: string;
        approver: {
            name: string;
        };
    }[];
    updated_by: {
        name: string;
    };
};

export type OverviewStats = {
    total_users: number;
    total_staffs: number;
    total_customers: number;
    total_balances: number;
    total_due_collections: number;
    total_pending_transactions: number;
    total_completed_transactions: number;
    total_cancelled_transactions: number;
    total_customer_deposits: number;
    total_payouts: number;
    total_income: number;
};

export type PerformanceMetrics = {
    total_customer_deposits: number;
    total_payouts: number;
    total_income: number;
    collectors_stats: {
        initiator_id: string;
        count: number;
        name: string;
        collection_volume: number;
    }[];
};

export type TransactionYearStats = {
    month: string;
    amount: number;
}[];

export type WalletHistory = PaginatedResponsePayload<
    {
        customer_id: string;
        debit: number;
        description: string;
        id: string;
        credit: number;
        created_at: string;
    }[],
    "wallet_history"
>;

export type UserPermissions = Record<string, { name: string; action: string }[]>;

export interface AppCustomRouteProps {
    children: JSX.Element;
    componentPermissions?: string[];
}