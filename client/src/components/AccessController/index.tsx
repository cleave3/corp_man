import { AppCustomRouteProps } from "../../api/types";
import { useAuthStore } from "../../hooks/useAuthStore";

const hasPermissions = (userPermissions: string[] = [], componentPermissions: string[] = []) => {
    if (componentPermissions.length === 0) return true;

    for (let index = 0; index < componentPermissions.length; index++) {
        const permission = componentPermissions[index];

        if (userPermissions.includes(permission)) return true;
    }

    return false;
};

const AccessWrapper = ({ componentPermissions = [], children }: AppCustomRouteProps) => {
    const user = useAuthStore((state) => state.user);

    if (componentPermissions.length === 0) return children;

    return hasPermissions(user?.permissions, componentPermissions) ? children : null;
};

export default AccessWrapper;
