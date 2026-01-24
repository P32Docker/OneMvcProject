import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { logout } from "../services/authSlice";
import APP_ENV from "../env";

export default function Header() {
    const user = useAppSelector(redux => redux.auth.user);
    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    const onLogout = () => {
        appDispatch(logout());
        navigate("/");
    };

    const baseUrl = APP_ENV.API_BASE_URL;

    const isAdmin = user?.roles?.includes("Admin");

    return (
        <header className="p-4 bg-blue-600 text-white">
            <nav className="flex gap-4 items-baseline">
                <Link to="/" className="hover:underline">Home</Link>
                <Link to="/city" className="hover:underline">City</Link>
                <Link to="/users/search" className="hover:underline">Users</Link>
                <Link to="/transportation" className="hover:underline">
                    Transportations
                </Link>
                {user != null && (
                    <Link to="/cart" className="hover:underline">
                        Cart
                    </Link>
                )}
                {isAdmin && (
                    <Link to="/admin" className="hover:underline">
                        AdminPanel
                    </Link>
                )}

                {user != null ? (

                        <div className="flex gap-4 ml-auto items-center">
                            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80">
                                <span className="hidden md:block">{user.name || user.email}</span>
                                <img
                                    src={user.image ? (user.image.startsWith('http') ? user.image : `${baseUrl}/images/${user.image}`) : "images (8).png"}
                                    alt="avatar"
                                    className="h-8 w-8 rounded-full object-cover border-2 border-white"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "images (8).png";
                                    }}
                                />
                            </Link>
                            <span
                                onClick={onLogout}
                                className="px-6 py-2 cursor-pointer bg-red-500 hover:bg-red-600 rounded text-sm transition-colors"
                            >
                                Вийти
                            </span>
                        </div>
                ) : (
                    <div className="flex gap-2 ml-auto">
                        <Link to="/login" className="hover:underline">
                            Login
                        </Link>
                        <Link to="/register" className="hover:underline">
                            Register
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
}