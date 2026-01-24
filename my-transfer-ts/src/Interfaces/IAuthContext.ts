import type {IUser} from "./IUser.ts";
import type {IRegisterModel} from "./IRegisterModel.ts";
import type {ILoginModel} from "./ILoginModel.ts";

export interface IAuthContext {
    googleLogin: (token: string) => Promise<void>;
    isAuth: boolean;
    login: (data: ILoginModel) => Promise<void>;
    logout: () => void;
    register: (data: IRegisterModel) => Promise<void>;
    user: IUser | null;
}