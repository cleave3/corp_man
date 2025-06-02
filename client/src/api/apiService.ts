// src/api/ApiService.ts
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
    CreateTransactionRequest
} from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:8000";

const api: AxiosInstance = axios.create({ baseURL: BASE_URL, withCredentials: true });

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
                const { data } = await axios.get(`${BASE_URL}/api/v1/auth/refresh-token`, {
                    withCredentials: true
                });
                Cookies.set("access_token", data.access_token, { expires: 1 });
                Cookies.set("refresh_token", data.refresh_token, { expires: 1 });
                originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                return api(originalRequest);
            } catch (err) {
                console.error(err);
                Cookies.remove("access_token");
                Cookies.remove("refresh_token");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default class ApiService {
    // Auth
    static loginUser(data: LoginUserRequest) {
        return api.post("/api/v1/auth/login-user", data);
    }

    static socioAuth(data: SocioAuthRequest) {
        return api.post("/api/v1/auth/socio-auth", data);
    }

    static getMe() {
        return api.get("/api/v1/auth/me");
    }

    static refreshToken() {
        return api.get("/api/v1/auth/refresh-token");
    }

    static logout() {
        return api.get("/api/v1/auth/logout");
    }

    static registerMember(data: RegisterMemberRequest) {
        return api.post("/api/v1/auth/register-member", data);
    }

    static resendVerification(data: ResendVerificationRequest) {
        return api.post("/api/v1/auth/resend-verification-code", data);
    }

    static changePassword(data: ChangePasswordRequest) {
        return api.patch("/api/v1/auth/change-password", data);
    }

    static forgotPassword(data: ForgotPasswordRequest) {
        return api.post("/api/v1/auth/forgot-password", data);
    }

    static getUsers() {
        return api.get("/api/v1/auth/users");
    }

    static getUserById(userId: string) {
        return api.get(`/api/v1/auth/user/${userId}`);
    }

    static updateUserStatus(userId: string, data: UpdateStatusRequest) {
        return api.patch(`/api/v1/auth/update-status/${userId}`, data);
    }

    static updateUserPermissions(userId: string, data: UpdatePermissionsRequest) {
        return api.patch(`/api/v1/auth/update-permissions/${userId}`, data);
    }

    // Analytics
    static getOverviewStats() {
        return api.get("/api/v1/analytics/overview-stats");
    }

    static getTransactionsByInitiator() {
        return api.get("/api/v1/analytics/transactions-initiator-stats");
    }

    static getTransactionYearStats() {
        return api.get("/api/v1/analytics/transaction-year-stats");
    }

    static getDueCollections() {
        return api.get("/api/v1/analytics/due-collections");
    }

    // Business
    static submitBusiness(data: SubmitBusinessRequest) {
        return api.post("/api/v1/business", data);
    }

    static getBusiness() {
        return api.get("/api/v1/business/me");
    }

    static updateBusinessPreferences(data: UpdateBusinessPreferencesRequest) {
        return api.patch("/api/v1/business/preferences", data);
    }

    // Customer
    static createCustomer(data: CreateCustomerRequest) {
        return api.post("/api/v1/customer", data);
    }

    static listCustomers(params: PaginatedQuery) {
        return api.get("/api/v1/customer", { params });
    }

    static getCustomerById(customerId: string) {
        return api.get(`/api/v1/customer/${customerId}`);
    }

    static updateCustomer(customerId: string, data: UpdateCustomerRequest) {
        return api.patch(`/api/v1/customer/${customerId}`, data);
    }

    // Transactions
    static createTransaction(data: CreateTransactionRequest) {
        return api.post("/api/v1/transaction", data);
    }

    static listTransactions(params: PaginatedQuery) {
        return api.get("/api/v1/transaction", { params });
    }

    static getTransaction(transactionId: string) {
        return api.get(`/api/v1/transaction/${transactionId}`);
    }

    static approveTransaction(transactionId: string) {
        return api.patch(`/api/v1/transaction/${transactionId}/approve`, {});
    }

    static declineTransaction(transactionId: string) {
        return api.patch(`/api/v1/transaction/${transactionId}/decline`, {});
    }

    static getWalletHistory(customerId: string, params: PaginatedQuery) {
        return api.get(`/api/v1/transaction/wallet-history/${customerId}`, { params });
    }
}
