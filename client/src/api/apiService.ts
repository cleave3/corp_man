import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import {
    LoginUserRequest,
    SocioAuthRequest,
    RegisterMemberRequest,
    ResendVerificationRequest,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    UpdateStatusRequest,
    UpdatePermissionsRequest,
    SubmitBusinessRequest,
    UpdateBusinessPreferencesRequest,
    CreateCustomerRequest,
    PaginatedQuery,
    UpdateCustomerRequest,
    CreateTransactionRequest,
    SignInResponseData,
    APIResponse,
    AuthUser,
    Customer,
    PaginatedResponsePayload,
    Transaction,
    Business,
    OverviewStats,
    TransactionYearStats,
    WalletHistory,
    UserPermissions,
    PerformanceMetrics
} from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api: AxiosInstance = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
    const token = Cookies.get("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry && Cookies.get("refresh_token")) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.get(`${BASE_URL}/api/v1/auth/refresh-token`);
                Cookies.set("access_token", data.access_token, { expires: 1 });
                Cookies.set("refresh_token", data.refresh_token, { expires: 1 });
                originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                return api(originalRequest);
            } catch (err) {
                console.error(err);
                Cookies.remove("access_token");
                Cookies.remove("refresh_token");
                Cookies.remove("auth_user");
                window.location.href = "/signin";
            }
        }
        return Promise.reject(error);
    }
);

export default class ApiService {
    // Auth
    static async loginUser(data: LoginUserRequest): Promise<APIResponse<SignInResponseData>> {
        try {
            const res = await api.post("/api/v1/auth/login-user", data);
            return res.data;
        } catch (error) {
            throw error?.response?.data;
        }
    }

    static async socioAuth(data: SocioAuthRequest): Promise<APIResponse<SignInResponseData>> {
        const res = await api.post("/api/v1/auth/socio-auth", data);
        return res.data;
    }

    static async getMe(headers = {}): Promise<APIResponse<AuthUser>> {
        try {
            const res = await api.get("/api/v1/auth/me", { headers: { ...headers } });
            Cookies.set("auth_user", JSON.stringify(res.data?.data), { expires: 1 });
            return res.data;
        } catch (error) {
            throw error?.response?.data;
        }
    }

    static async refreshToken(): Promise<APIResponse<SignInResponseData>> {
        const res = await api.get("/api/v1/auth/refresh-token");
        return res.data;
    }

    static async logout(): Promise<APIResponse<unknown>> {
        const res = await api.get("/api/v1/auth/logout");
        return res.data;
    }

    static async registerMember(data: RegisterMemberRequest): Promise<APIResponse<unknown>> {
        try {
            const res = await api.post("/api/v1/auth/register-member", data);
            return res.data;
        } catch (error) {
            throw error?.response?.data;
        }
    }

    static async getUserPermissions(): Promise<APIResponse<UserPermissions>> {
        const res = await api.get("/api/v1/auth/user-permissions");
        return res.data;
    }

    static async resendVerification(data: ResendVerificationRequest): Promise<APIResponse<unknown>> {
        const res = await api.post("/api/v1/auth/resend-verification-code", data);
        return res.data;
    }

    static async changePassword(data: ChangePasswordRequest): Promise<APIResponse<unknown>> {
        try {
            const res = await api.patch("/api/v1/auth/change-password", data);
            return res.data;
        } catch (error) {
            throw error?.response?.data;
        }
    }

    static async forgotPassword(data: ForgotPasswordRequest): Promise<APIResponse<unknown>> {
        const res = await api.post("/api/v1/auth/forgot-password", data);
        return res.data;
    }

    static async getUsers(): Promise<APIResponse<AuthUser[]>> {
        const res = await api.get("/api/v1/auth/users");
        return res.data;
    }

    static async getUserById(userId: string): Promise<APIResponse<unknown>> {
        const res = await api.get(`/api/v1/auth/user/${userId}`);
        return res.data;
    }

    static async updateUserStatus(userId: string, data: UpdateStatusRequest): Promise<APIResponse<unknown>> {
        try {
            const res = await api.patch(`/api/v1/auth/update-status/${userId}`, data);
            return res.data;
        } catch (error) {
            throw error?.response?.data;
        }
    }

    static async updateUserPermissions(userId: string, data: UpdatePermissionsRequest): Promise<APIResponse<unknown>> {
        try {
            const res = await api.patch(`/api/v1/auth/update-permissions/${userId}`, data);
            return res.data;
        } catch (error) {
            throw error?.response?.data;
        }
    }

    // Analytics
    static async getOverviewStats(): Promise<APIResponse<OverviewStats>> {
        const res = await api.get("/api/v1/analytics/overview-stats");
        return res.data;
    }

    static async getTransactionsByInitiator(params: { year: string; month: string }): Promise<APIResponse<PerformanceMetrics>> {
        const res = await api.get("/api/v1/analytics/transactions-initiator-stats", { params });
        return res.data;
    }

    static async getTransactionYearStats(params: { year: string }): Promise<APIResponse<TransactionYearStats>> {
        const res = await api.get("/api/v1/analytics/transaction-year-stats", { params });
        return res.data;
    }

    static async getDueCollections(): Promise<APIResponse<unknown>> {
        const res = await api.get("/api/v1/analytics/due-collections");
        return res.data;
    }

    // Business
    static async submitBusiness(data: SubmitBusinessRequest): Promise<APIResponse<unknown>> {
        const res = await api.post("/api/v1/business", data);
        return res.data;
    }

    static async getBusiness(): Promise<APIResponse<Business>> {
        const res = await api.get("/api/v1/business/me");
        return res.data;
    }

    static async updateBusinessPreferences(data: UpdateBusinessPreferencesRequest): Promise<APIResponse<unknown>> {
        const res = await api.patch("/api/v1/business/preferences", data);
        return res.data;
    }

    // Customer
    static async createCustomer(data: CreateCustomerRequest): Promise<APIResponse<unknown>> {
        try {
            const res = await api.post("/api/v1/customer", data);
            return res.data;
        } catch (error) {
            throw error?.response?.data;
        }
    }

    static async listCustomers(params: PaginatedQuery): Promise<PaginatedResponsePayload<Customer[], "customers">> {
        const res = await api.get("/api/v1/customer", { params });
        return res.data;
    }

    static async getAllCustomers(): Promise<APIResponse<Customer[]>> {
        const res = await api.get("/api/v1/customer/all");
        return res.data;
    }

    static async getCustomerById(customerId: string): Promise<APIResponse<unknown>> {
        const res = await api.get(`/api/v1/customer/${customerId}`);
        return res.data;
    }

    static async updateCustomer(customerId: string, data: UpdateCustomerRequest): Promise<APIResponse<unknown>> {
        try {
            const res = await api.patch(`/api/v1/customer/${customerId}`, data);
            return res.data;
        } catch (error) {
            throw error?.response?.data;
        }
    }

    // Transactions
    static async createTransaction(data: CreateTransactionRequest): Promise<APIResponse<unknown>> {
        try {
            const res = await api.post("/api/v1/transaction", data);
            return res.data;
        } catch (error) {
            throw error?.response?.data;
        }
    }

    static async listTransactions(params: PaginatedQuery): Promise<PaginatedResponsePayload<Transaction[], "transactions">> {
        const res = await api.get("/api/v1/transaction", { params });
        return res.data;
    }

    static async getTransaction(transactionId: string): Promise<APIResponse<unknown>> {
        const res = await api.get(`/api/v1/transaction/${transactionId}`);
        return res.data;
    }

    static async approveTransaction(transactionId: string): Promise<APIResponse<unknown>> {
        try {
            const res = await api.patch(`/api/v1/transaction/${transactionId}/approve`, {});
            return res.data;
        } catch (error) {
            throw error?.response?.data;
        }
    }

    static async declineTransaction(transactionId: string): Promise<APIResponse<unknown>> {
        try {
            const res = await api.patch(`/api/v1/transaction/${transactionId}/decline`, {});
            return res.data;
        } catch (error) {
            throw error?.response?.data;
        }
    }

    static async getWalletHistory(customerId: string, params: PaginatedQuery): Promise<WalletHistory> {
        const res = await api.get(`/api/v1/transaction/wallet-history/${customerId}`, { params });
        return res.data;
    }
}
