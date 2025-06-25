import { create } from "zustand";
import Cookies from "js-cookie";
import { AuthUser } from "../api/types";
import ApiService from "../api/apiService";
import { toast } from "react-toastify";

type AuthState = {
    user: AuthUser | null;
    login: (args: { access_token?: string; refresh_token?: string; user?: AuthUser }) => void;
    logout: () => void;
    refreshAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => {
    const authUserCookie = Cookies.get("auth_user");
    const user = authUserCookie ? JSON.parse(authUserCookie) : null;

    return {
        user,
        login: ({ access_token, refresh_token, user }) => {
            if (access_token) Cookies.set("access_token", access_token, { expires: 1 });
            if (refresh_token) Cookies.set("refresh_token", refresh_token, { expires: 1 });
            if (user) Cookies.set("auth_user", JSON.stringify(user), { expires: 1 });
            set({ user: user ?? null });
        },
        refreshAuth: async () => {
            const user = await ApiService.getMe();
            set({ user: user.data ?? null });
        },
        logout: async () => {
            try {
                await toast.promise(ApiService.logout(), {
                    pending: "Logging out...",
                    success: "Logged out successfully!"
                    // error: "Logout failed!"
                });
                Cookies.remove("access_token");
                Cookies.remove("refresh_token");
                Cookies.remove("auth_user");
                set({ user: null });
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                Cookies.remove("access_token");
                Cookies.remove("refresh_token");
                Cookies.remove("auth_user");
                set({ user: null });
            }
        }
    };
});
