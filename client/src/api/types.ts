import { JSX } from "react";

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
    image_url: string;
    address: string;
    payment_frequency: string;
    next_payment_date: string;
    opening_balance: number;
}

export type UpdateCustomerRequest = Partial<Omit<CreateCustomerRequest, "opening_balance">>;

export interface CreateTransactionRequest {
    amount: number;
    transaction_type: string;
    description: string;
    meta_data: {
        customer_id: string;
        next_payment_date: string;
    };
}

export interface PaginatedQuery {
    status?: string;
    page?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
}

export type AuthUser = {
    uid: string;
    phone: string;
    last_name: string;
    permissions: string[];
    updated_at: string;
    business_id: string;
    email: string;
    first_name: string;
    image_url: null;
    created_at: string;
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
