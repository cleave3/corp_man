import { create } from "zustand";
import Cookies from "js-cookie";
import { AuthUser } from "../api/types";

type AuthState = {
    user: AuthUser | null;
    login: (access_token: string, refresh_token: string, user: AuthUser) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => {
    const authUserCookie = Cookies.get("auth_user");
    const user = authUserCookie ? JSON.parse(authUserCookie) : null;

    return {
        user,
        login: (access_token, refresh_token, user) => {
            Cookies.set("access_token", access_token, { expires: 1 });
            Cookies.set("refresh_token", refresh_token, { expires: 1 });
            Cookies.set("auth_user", JSON.stringify(user), { expires: 1 });
            set({ user });
        },
        logout: () => {
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            Cookies.remove("auth_user");
            set({ user: null });
        }
    };
});
