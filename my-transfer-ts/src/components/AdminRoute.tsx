import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store";

const AdminRoute = () => {
    const { user } = useAppSelector(state => state.auth);


    if (!user) {
        return <Navigate to="/login" replace />;
    }
    const isAdmin = Array.isArray(user.roles)
        ? user.roles.includes("Admin")
        : user.roles === "Admin";

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default AdminRoute;