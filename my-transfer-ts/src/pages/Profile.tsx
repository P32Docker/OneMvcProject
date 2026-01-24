import { useAuth } from "../context/AuthContext";
import APP_ENV from "../env";
import {useAppDispatch} from "../store";
import {useNavigate} from "react-router-dom";
import {logout} from "../services/authSlice.ts";

const Profile = () => {
    const { user } = useAuth();

    if (!user) return <div className="text-center mt-10">Завантаження...</div>;
    const imageUrl = user.image.startsWith("http")
        ? user.image
        : `${APP_ENV.API_BASE_URL}/images/${user.image}`;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const appDispatch = useAppDispatch();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate();
    const onLogout = () => {
        appDispatch(logout());
        navigate("/");
    };
    const finalImage = user.image ? imageUrl : "images (8).png";

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                    <div className=" md:flex-shrink-0  flex items-center justify-center md:w-48">
                        <img
                            className="h-48 w-full object-cover md:w-48"
                            src={finalImage}
                            alt={user.fullName}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "images (8).png";
                            }}
                        />
                    </div>
                    <div className="p-8 w-full">
                        <h1 className="block mt-1 text-2xl leading-tight font-medium text-black">
                            {user.fullName}
                        </h1>

                        <p className="mt-2 text-gray-500">
                            {user.email}
                        </p>

                        <p className="mt-2 text-gray-500">
                            {user.phone}
                        </p>

                        <div className="mt-8 border-t pt-6">
                            <button
                                onClick={onLogout}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                            >
                                Вийти з акаунту
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;