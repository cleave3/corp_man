import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginUserRequest, PaginatedQuery, UpdateCustomerRequest, UpdatePermissionsRequest, UpdateStatusRequest } from "../api/types";
import ApiService from "../api/apiService";
import { useAuthStore } from "./useAuthStore";

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

export const useUpdateUserPermissions = () => {
    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: UpdatePermissionsRequest }) => ApiService.updateUserPermissions(userId, data)
    });
};

// Analytics Hooks
export const useOverviewStats = () => useQuery({ queryKey: ["overviewStats"], queryFn: ApiService.getOverviewStats });

export const useTransactionsByInitiator = (year: number, month: number) => {
    return useQuery({
        queryKey: ["transactionsByInitiator", year, month],
        queryFn: ({ queryKey }) => ApiService.getTransactionsByInitiator({ year: queryKey[1] as string, month: queryKey[2] as string })
    });
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
    return useMutation({
        mutationFn: ApiService.updateBusinessPreferences
    });
};

// Customer Hooks
export const useCreateCustomer = () => useMutation({ mutationFn: ApiService.createCustomer });

export const useCustomers = (params: PaginatedQuery) => {
    return useQuery({
        queryKey: ["customers", params.page, params.search, params.start_date, params.end_date, params.customer_type],
        queryFn: () => ApiService.listCustomers(params)
    });
};

export const useGetAllCustomers = () => {
    return useQuery({
        queryKey: ["allcustomers"],
        queryFn: () => ApiService.getAllCustomers()
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

export const usePendingTransactions = () => {
    return useQuery({
        queryKey: ["pendingTransactions"],
        queryFn: () => ApiService.listTransactions({ status: "pending" })
    });
};

export const useGetTransaction = (transactionId: string) => {
    return useQuery({ queryKey: ["transaction", transactionId], queryFn: () => ApiService.getTransaction(transactionId) });
};

export const useApproveTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (transactionId: string) => {
            await toast.promise(ApiService.approveTransaction(transactionId), {
                pending: "processing...",
                success: "Transaction approved successfully",
                error: "operation unsuccessful"
            });
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["pendingTransactions"] });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};

export const useDeclineTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (transactionId: string) => {
            await toast.promise(ApiService.declineTransaction(transactionId), {
                pending: "processing...",
                success: "Transaction declined successfully",
                error: "operation unsuccessful"
            });
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["pendingTransactions"] });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};

export const useWalletHistory = (customerId: string, params: PaginatedQuery) => {
    return useQuery({
        queryKey: ["walletHistory", customerId, params.page, params.start_date, params.end_date],
        queryFn: () => ApiService.getWalletHistory(customerId, params)
    });
};
