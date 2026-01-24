import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import {Link, useNavigate} from 'react-router-dom';
import {Formik, Form, Field, ErrorMessage, type FormikHelpers} from 'formik';
import * as yup from 'yup';
import type {ILoginModel} from "../Interfaces/ILoginModel.ts";

const LoginSchema = yup.object({
    email: yup.string().email("Некоректна пошта").required("Введіть пошту"),
    password: yup.string().required("Введіть пароль").min(6, "Мінімум 6 символів")
});

const LoginPage = () => {
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const handleGoogleSuccess = async (response: CredentialResponse) => {
        if (response.credential) {
            await googleLogin(response.credential);
            navigate("/");
        }
    };

    const handleSubmit = async (values: ILoginModel, { setSubmitting, setStatus }: FormikHelpers<ILoginModel>) => {
        try {
            await login(values);
            navigate("/");
        } catch (error) {
            setStatus(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-gray-900">Вхід</h1>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, status }) => (
                        <Form className="space-y-4">
                            {status && <div className="text-red-500 text-center text-sm">{status}</div>}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <Field name="email" type="email" className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            <div>
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-700">Пароль</label>
                                </div>
                                <Field name="password" type="password" className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
                                >
                                    Забули пароль?
                                </Link>
                                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-gray-400"
                            >
                                {isSubmitting ? "Вхід..." : "Увійти"}
                            </button>
                        </Form>
                    )}
                </Formik>

                <div className="flex justify-center">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert('Login Failed')} useOneTap={false} />
                </div>

                <div className="text-center text-sm text-gray-600">
                    Ще не маєте акаунту? <Link to="/register" className="text-blue-600 hover:underline">Зареєструватися</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;