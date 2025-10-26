import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
    const { token, isAuthenticated } = useSelector((state) => state.auth);

    if (!token || !isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();
        if (isTokenExpired) {
            return <Navigate to="/" replace />;
        }
    } catch (error) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
