import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/Home";
import CityPage from "../pages/City"
import CreateCity from "../Modals/CreateCity/CityForm.tsx";
import LoginPage from "../pages/Login"
import RegisterPage from "../pages/Register.tsx";
import ProfilePage from "../pages/Profile";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            { path: "city", element: <CityPage />},
            { path: "city/create", element: <CreateCity /> },
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "profile", element: <ProfilePage /> }
        ],
    },
]);