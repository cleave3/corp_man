import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginUserRequest, PaginatedQuery, UpdateCustomerRequest, UpdatePermissionsRequest, UpdateStatusRequest } from "../api/types";
import ApiService from "../api/apiService";
import { useAuthStore } from "./useAuthStore";

// queryClient.invalidateQueries({ queryKey: ['todos'] })

// Auth Hooks
export const useLoginUser = () => {
    const login = useAuthStore((state) => state.login);
    return useMutation({
        mutationFn: (data: LoginUserRequest) => ApiService.loginUser(data),
        onSuccess: async (data) => {
            toast.success(data.message);
            const user = await ApiService.getMe({ Authorization: `Bearer ${data?.data?.access_token}` });
            login({ access_token: data?.data?.access_token, refresh_token: data?.data?.refresh_token, user: user.data });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};
export const useSocioAuth = () => useMutation({ mutationFn: ApiService.socioAuth });
export const useGetMe = () => {
    return useQuery({ queryKey: ["me"], queryFn: ApiService.getMe, refetchOnWindowFocus: true });
};
export const useRegisterMember = () => useMutation({ mutationFn: ApiService.registerMember });
export const useResendVerification = () => useMutation({ mutationFn: ApiService.resendVerification });
export const useChangePassword = () => useMutation({ mutationFn: ApiService.changePassword });
export const useForgotPassword = () => {
    return useMutation({
        mutationFn: ApiService.forgotPassword,
        onSuccess: async (data) => {
            toast.info(data.message, { autoClose: false, closeButton: true, position: "top-center" });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};
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

export const useTransactionsByInitiator = () => {
    return useQuery({ queryKey: ["transactionsByInitiator"], queryFn: ApiService.getTransactionsByInitiator });
};

export const useTransactionYearStats = (year: string) =>
    useQuery({
        queryKey: ["transactionYearStats", year],
        queryFn: ({ queryKey }) => ApiService.getTransactionYearStats({ year: queryKey[1] as string })
    });

export const useDueCollections = () => useQuery({ queryKey: ["dueCollections"], queryFn: ApiService.getDueCollections });

// Business Hooks
export const useSubmitBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ApiService.submitBusiness,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business"] });

            toast.success("Business profile Updated successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};

export const useGetBusiness = () => useQuery({ queryKey: ["business"], queryFn: ApiService.getBusiness });

export const useUpdateBusinessPreferences = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ApiService.updateBusinessPreferences,
        onSuccess: (data, variables, context) => {
            console.log({ data, variables, context });
            queryClient.invalidateQueries({ queryKey: ["business"] });
            toast.success("Business preference Updated successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};

// Customer Hooks
export const useCreateCustomer = () => useMutation({ mutationFn: ApiService.createCustomer });

export const useCustomers = (params: PaginatedQuery) => {
    return useQuery({
        queryKey: ["customers", params.page],
        queryFn: () => ApiService.listCustomers(params)
    });
};
export const useGetCustomerById = (customerId: string) => {
    return useQuery({ queryKey: ["customer", customerId], queryFn: () => ApiService.getCustomerById(customerId) });
};

export const useUpdateCustomer = () => {
    return useMutation({
        mutationFn: ({ customerId, data }: { customerId: string; data: UpdateCustomerRequest }) =>
            ApiService.updateCustomer(customerId, data)
    });
};

// Transaction Hooks
export const useCreateTransaction = () => useMutation({ mutationFn: ApiService.createTransaction });

export const useTransactions = (params: PaginatedQuery) => {
    return useQuery({
        queryKey: ["transactions", params.page, params.status, params.start_date, params.end_date, params.limit],
        queryFn: () => ApiService.listTransactions(params)
    });
};

export const useGetTransaction = (transactionId: string) => {
    return useQuery({ queryKey: ["transaction", transactionId], queryFn: () => ApiService.getTransaction(transactionId) });
};

export const useApproveTransaction = () => {
    return useMutation({ mutationFn: (transactionId: string) => ApiService.approveTransaction(transactionId) });
};

export const useDeclineTransaction = () => {
    return useMutation({ mutationFn: (transactionId: string) => ApiService.declineTransaction(transactionId) });
};

export const useWalletHistory = (customerId: string, params: PaginatedQuery) => {
    return useQuery({
        queryKey: ["walletHistory", customerId, params.page],
        queryFn: () => ApiService.getWalletHistory(customerId, params)
    });
};
