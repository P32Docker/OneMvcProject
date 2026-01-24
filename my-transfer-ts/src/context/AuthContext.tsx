import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import axios from "axios";
import APP_ENV from "../env";
import type {IUser} from "../Interfaces/IUser.ts";
import type {IAuthContext} from "../Interfaces/IAuthContext.ts";
import type {ILoginModel} from "../Interfaces/ILoginModel.ts";
import type {IRegisterModel} from "../Interfaces/IRegisterModel.ts";
import {jwtDecode} from "jwt-decode";
import type {UserTokenInfo} from "../Interfaces/IUserTokenInfo.ts";
import {loginSuccess} from "../services/authSlice.ts";
import {useAppDispatch} from "../store";

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const appDispatch = useAppDispatch();

    const loadUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if(token) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                const { data } = await axios.get(`${APP_ENV.API_BASE_URL}/api/account/me`);
                setUser(data);
                setIsAuth(true);
            }
        }
        catch (error) {
            console.error("Auth error:", error);
            logout();
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadUser(); }, []);

    const googleLogin = async (googleToken: string) => {
        try {
            const result = await axios.post(`${APP_ENV.API_BASE_URL}/api/account/google-login`, {
                token: googleToken
            });
            const { token } = result.data;
            appDispatch(loginSuccess(token));
            localStorage.setItem("token", token);
            await loadUser();
        }
        catch (error) {
            console.error("Login failed", error);
            alert("Помилка входу");
        }
    };
    const login = async (model: ILoginModel) => {
        try {
            const result = await axios.post(`${APP_ENV.API_BASE_URL}/api/account/login`, model);
            const { token } = result.data;
            appDispatch(loginSuccess(token));
            const decode = jwtDecode<UserTokenInfo>(token);
            console.log("Decode token: ", decode);
            console.log("Registered:", result.data.token)
            localStorage.setItem("token", token);
            await loadUser();
        } catch (error) {
            console.error(error);
        }
    };
    const register = async (model: IRegisterModel) => {
        try {
            const formData = new FormData();

            formData.append('firstName', model.firstName);
            formData.append('lastName', model.lastName);
            formData.append('email', model.email);
            formData.append('password', model.password);
            formData.append('phone', model.phone);
            formData.append('confirmPassword', model.confirmPassword);


            if (model.image && model.image.length > 0) {
                formData.append('image', model.image[0]);
            }
            const result = await axios.post(
                `${APP_ENV.API_BASE_URL}/api/account/register`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const { token } = result.data;
            localStorage.setItem("token", token);
            appDispatch(loginSuccess(token));
            await loadUser();
        } catch (error) {
            console.error("Registration error:", error);
            throw error; //
        }
    };

    const logout = async () => {
        localStorage.removeItem("token");
        await axios.post(`${APP_ENV.API_BASE_URL}/api/account/logout`);
        setUser(null);
        setIsAuth(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuth, login, logout, googleLogin, register }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};