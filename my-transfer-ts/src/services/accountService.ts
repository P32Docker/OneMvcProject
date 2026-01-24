import axios from "axios";
import APP_ENV from "../env";
import type {ISearchUsers} from "../Interfaces/ISearchUsers.ts";
import type {IUser} from "../Interfaces/IUser.ts";
import type {ISearchResult} from "../Interfaces/ISearchResult.ts";
import type {IForgotPassword} from "../Interfaces/IForgotPassword.ts";
import type {IResetPassword} from "../Interfaces/IResetPassword.ts";

const API_URL = `${APP_ENV.API_BASE_URL}/api/account`;

export const searchUsers = async (params: ISearchUsers): Promise<ISearchResult<IUser>> => {
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v != null && v !== '')
    );

    const response = await axios.get<ISearchResult<IUser>>(`${API_URL}`, {
        params: cleanParams
    });

    return response.data;
};
export const forgotPasswordRequest = async (model: IForgotPassword) => {
    return await axios.post(`${API_URL}/forgot-password`, model);
};

export const resetPasswordRequest = async (model: IResetPassword) => {
    return await axios.post(`${API_URL}/reset-password`, model);
};
