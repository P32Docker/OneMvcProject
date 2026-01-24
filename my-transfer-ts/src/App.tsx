import Header from "./components/Header";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import {useAppSelector} from "./store";
import HomePage from "./pages/Home";
import CityPage from "./pages/City"
import CreateCity from "./Modals/CreateCity/CityForm.tsx";
import LoginPage from "./pages/Login"
import RegisterPage from "./pages/Register.tsx";
import ProfilePage from "./pages/Profile";
import HomeAdmin from "./admin/pages/Dashboard/Home.tsx";
import AppLayout from "./admin/layout/AppLayout.tsx";
import UserProfiles from "./admin/pages/UserProfiles.tsx";
import Calendar from "./admin/pages/Calendar.tsx";
import Blank from "./admin/pages/Blank.tsx";
import FormElements from "./admin/pages/Forms/FormElements.tsx";
import BasicTables from "./admin/pages/Tables/BasicTables.tsx";
import Alerts from "./admin/pages/UiElements/Alerts.tsx";
import Avatars from "./admin/pages/UiElements/Avatars.tsx";
import Badges from "./admin/pages/UiElements/Badges.tsx";
import Buttons from "./admin/pages/UiElements/Buttons.tsx";
import Images from "./admin/pages/UiElements/Images.tsx";
import Videos from "./admin/pages/UiElements/Videos.tsx";
import LineChart from "./admin/pages/Charts/LineChart.tsx";
import BarChart from "./admin/pages/Charts/BarChart.tsx";
import SignIn from "./admin/pages/AuthPages/SignIn.tsx";
import SignUp from "./admin/pages/AuthPages/SignUp.tsx";
import NotFound from "./admin/pages/OtherPage/NotFound.tsx";
import AdminRoute from "./components/AdminRoute.tsx";
import SearchUsersPage from "./pages/SearchUsers.tsx";
import CityAdminPage from "./admin/pages/LocationPage/CityAdmin.tsx"
import CountryAdminPage from "./admin/pages/LocationPage/CountryAdmin.tsx"
import CreateCountry from "./Modals/CreateCountry/CountryForm.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import TransportationPage from "./pages/Transportation.tsx";
import TransportationAdminPage from "./admin/pages/OtherPage/TransportationAdmin.tsx"
import CartPage from "./pages/Cart.tsx";
import CartAdminPage from "./admin/pages/OtherPage/CartAdmin.tsx";



const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default function App() {
    const user =
        useAppSelector(redux => redux.auth.user);

    console.log("User roles", user?.roles);
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<MainLayout/>}>
                    <Route index element={<HomePage/>}/>
                    <Route path="city" element={<CityPage /> }/>,
                    <Route path="login" element={<LoginPage/> }/>
                    <Route path="register" element={<RegisterPage/> }/>
                    <Route path="profile" element={<ProfilePage/> }/>
                    <Route path="users/search" element={<SearchUsersPage/>}/>
                    <Route path="forgot-password" element={<ForgotPassword/>}/>
                    <Route path="reset-password" element={<ResetPassword/>}/>
                    <Route path="transportation" element={<TransportationPage/>}/>
                    <Route path="cart" element={<CartPage/>}/>
                </Route>
                <Route element={<AdminRoute />}>
                    <Route path={"/admin"} element={<AppLayout />}>
                        <Route index element={<HomeAdmin />} />
                        <Route path="transportation" element={<TransportationAdminPage />}/>
                        <Route path="cart" element={<CartAdminPage />}/>
                        <Route path="location">
                            <Route path="countries" element={<CountryAdminPage />} />
                            <Route path="cities" element={<CityAdminPage />} />
                            <Route path="cities/create" element={<CreateCity />} />
                            <Route path="countries/create" element={<CreateCountry />} />
                        </Route>
                        {/* Others Page */}
                        <Route path="profile" element={<UserProfiles />} />
                        <Route path="calendar" element={<Calendar />} />
                        <Route path="blank" element={<Blank />} />

                        {/* Forms */}
                        <Route path="form-elements" element={<FormElements />} />

                        {/* Tables */}
                        <Route path="basic-tables" element={<BasicTables />} />

                        {/* Ui Elements */}
                        <Route path="alerts" element={<Alerts />} />
                        <Route path="avatars" element={<Avatars />} />
                        <Route path="badge" element={<Badges />} />
                        <Route path="buttons" element={<Buttons />} />
                        <Route path="images" element={<Images />} />
                        <Route path="videos" element={<Videos />} />

                        {/* Charts */}
                        <Route path="line-chart" element={<LineChart />} />
                        <Route path="bar-chart" element={<BarChart />} />
                    </Route>
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                </Route>
                    <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}