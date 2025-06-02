import { Navigate } from "react-router";
import { useAuthStore } from "../../hooks/useAuthStore";
import { AppCustomRouteProps } from "../../api/types";
import { ROUTES } from "../../utils";

export const PublicRoute = ({ children }: AppCustomRouteProps) => {
    const user = useAuthStore((state) => state.user);

    return !user ? children : <Navigate to={ROUTES.DASHBOARD} />;
};

const hasPermissions = (userPermissions: string[] = [], componentPermissions: string[] = []) => {
    if (componentPermissions.length === 0) return true;

    for (let index = 0; index < componentPermissions.length; index++) {
        const permission = componentPermissions[index];

        if (userPermissions.includes(permission)) return true;
    }

    return false;
};

export const PrivateRoute = ({ children, componentPermissions = [] }: AppCustomRouteProps) => {
    const user = useAuthStore((state) => state.user);

    if (!user) return <Navigate to={ROUTES.SIGNIN} />;

    if (componentPermissions.length === 0) return children;

    if (user?.permissions?.length === 0 || !user) return children;

    return hasPermissions(user?.permissions, componentPermissions) ? children : <Navigate to={ROUTES.PROFILE} />;
};
