import { create } from "zustand";
import { AuthUser, UserPermissions, StaticFunc } from "../api/types";
import ApiService from "../api/apiService";

type UserState = {
    selectedUser: AuthUser | null;
    selectUser: (user: AuthUser | null) => void;
    permissions: UserPermissions;
    getUserPermissions: StaticFunc;
};

export const useUserStore = create<UserState>((set) => {
    return {
        selectedUser: null,
        permissions: {},
        selectUser: (user) => {
            set({ selectedUser: user });
        },
        getUserPermissions: async () => {
            const result = await ApiService.getUserPermissions();
            set({ permissions: result.data });
        }
    };
});
