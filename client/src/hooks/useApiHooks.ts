// src/api/hooks.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { LoginUserRequest, PaginatedQuery, UpdateCustomerRequest, UpdatePermissionsRequest, UpdateStatusRequest } from "../api/types";
import ApiService from "../api/apiService";

// queryClient.invalidateQueries({ queryKey: ['todos'] })

// Auth Hooks
export const useLoginUser = () =>
    useMutation({
        mutationFn: (data: LoginUserRequest) => ApiService.loginUser(data),
        onSuccess(data, variables, context) {
            console.log({ data, variables, context });
        },
        onError(error, variables, context) {
            console.log({ error, variables, context });
        }
    });
export const useSocioAuth = () => useMutation({ mutationFn: ApiService.socioAuth });
export const useGetMe = () => useQuery({ queryKey: ["me"], queryFn: ApiService.getMe });
export const useLogout = () => useMutation({ mutationFn: ApiService.logout });
export const useRegisterMember = () => useMutation({ mutationFn: ApiService.registerMember });
export const useResendVerification = () => useMutation({ mutationFn: ApiService.resendVerification });
export const useChangePassword = () => useMutation({ mutationFn: ApiService.changePassword });
export const useForgotPassword = () => useMutation({ mutationFn: ApiService.forgotPassword });
export const useGetUsers = () => useQuery({ queryKey: ["users"], queryFn: ApiService.getUsers });
export const useGetUserById = (userId: string) => useQuery({ queryKey: ["user", userId], queryFn: () => ApiService.getUserById(userId) });
export const useUpdateUserStatus = () =>
    useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: UpdateStatusRequest }) => ApiService.updateUserStatus(userId, data)
    });
export const useUpdateUserPermissions = () =>
    useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: UpdatePermissionsRequest }) => ApiService.updateUserPermissions(userId, data)
    });

// Analytics Hooks
export const useOverviewStats = () => useQuery({ queryKey: ["overviewStats"], queryFn: ApiService.getOverviewStats });
export const useTransactionsByInitiator = () =>
    useQuery({ queryKey: ["transactionsByInitiator"], queryFn: ApiService.getTransactionsByInitiator });
export const useTransactionYearStats = () => useQuery({ queryKey: ["transactionYearStats"], queryFn: ApiService.getTransactionYearStats });
export const useDueCollections = () => useQuery({ queryKey: ["dueCollections"], queryFn: ApiService.getDueCollections });

// Business Hooks
export const useSubmitBusiness = () => useMutation({ mutationFn: ApiService.submitBusiness });
export const useGetBusiness = () => useQuery({ queryKey: ["business"], queryFn: ApiService.getBusiness });
export const useUpdateBusinessPreferences = () => useMutation({ mutationFn: ApiService.updateBusinessPreferences });

// Customer Hooks
export const useCreateCustomer = () => useMutation({ mutationFn: ApiService.createCustomer });
export const useCustomers = (params: PaginatedQuery) =>
    useQuery({ queryKey: ["customers", params.page], queryFn: () => ApiService.listCustomers(params) });
export const useGetCustomerById = (customerId: string) =>
    useQuery({ queryKey: ["customer", customerId], queryFn: () => ApiService.getCustomerById(customerId) });
export const useUpdateCustomer = () =>
    useMutation({
        mutationFn: ({ customerId, data }: { customerId: string; data: UpdateCustomerRequest }) =>
            ApiService.updateCustomer(customerId, data)
    });

// Transaction Hooks
export const useCreateTransaction = () => useMutation({ mutationFn: ApiService.createTransaction });
export const useTransactions = (params: PaginatedQuery) =>
    useQuery({ queryKey: ["transactions", params.page], queryFn: () => ApiService.listTransactions(params) });
export const useGetTransaction = (transactionId: string) =>
    useQuery({ queryKey: ["transaction", transactionId], queryFn: () => ApiService.getTransaction(transactionId) });
export const useApproveTransaction = () =>
    useMutation({ mutationFn: (transactionId: string) => ApiService.approveTransaction(transactionId) });
export const useDeclineTransaction = () =>
    useMutation({ mutationFn: (transactionId: string) => ApiService.declineTransaction(transactionId) });
export const useWalletHistory = (customerId: string, params: PaginatedQuery) =>
    useQuery({ queryKey: ["walletHistory", customerId, params.page], queryFn: () => ApiService.getWalletHistory(customerId, params) });
