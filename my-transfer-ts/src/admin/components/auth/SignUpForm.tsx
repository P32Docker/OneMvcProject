import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as yup from 'yup';
import type { IRegisterModel } from "../../../Interfaces/IRegisterModel.ts";
import { ChevronLeftIcon } from "../../icons";

const phoneRegExp = /^\+380\d{9}$/;

const RegisterSchema = yup.object({
    firstName: yup.string().required("Введіть ім'я"),
    lastName: yup.string().required("Введіть прізвище"),
    email: yup.string().email("Некоректна пошта").required("Введіть пошту"),
    password: yup.string().required("Введіть пароль").min(6, "Мінімум 6 символів"),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Паролі не співпадають')
        .required('Підтвердіть пароль'),
    phone: yup.string()
        .matches(phoneRegExp, 'Невірний формат')
        .required("Введіть номер телефону"),
});

export default function SignUpForm() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [preview, setPreview] = useState<string | null>(null);

    const handleSubmit = async (values: IRegisterModel, { setSubmitting, setStatus }: FormikHelpers<IRegisterModel>) => {
        try {
            await register(values);
            navigate("/");
        } catch (error) {
            setStatus(error);
        } finally {
            setSubmitting(false);
        }
    };
    const inputClasses = "mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar transition-colors duration-300 dark:bg-gray-900">
            <div className="w-full max-w-md mx-auto mb-5 sm:pt-10 px-4 sm:px-0">
                <Link
                    to="/admin/"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon className="size-5 mr-1" />
                    Back to dashboard
                </Link>
            </div>
            <div className="flex justify-center items-center min-h-screen py-10 px-4 sm:px-0">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg transition-colors duration-300 dark:bg-gray-800 dark:border dark:border-gray-700">
                    <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Реєстрація</h1>

                    <Formik<IRegisterModel> initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: '', image: null }} validationSchema={RegisterSchema} onSubmit={handleSubmit}>
                        {({ isSubmitting, status, setFieldValue }) => (
                            <Form className="space-y-4">
                                {status && <div className="text-red-500 text-center text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">{status}</div>}

                                <div className="flex flex-col items-center gap-2 mb-4">
                                    <label
                                        htmlFor="imageUpload"
                                        className="cursor-pointer group relative w-24 h-24 rounded-full overflow-hidden flex items-center justify-center border-2 border-transparent hover:border-blue-500 transition-all dark:hover:border-blue-400"
                                    >
                                        <img
                                            src={preview || "images (8).png"}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity">
                                            Змінити
                                        </div>
                                    </label>
                                    <input
                                        id="imageUpload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.currentTarget.files?.[0];
                                            if (file) {
                                                setFieldValue("image", e.currentTarget.files);
                                                setPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    <ErrorMessage name="image" component="div" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClasses}>Ім'я</label>
                                        <Field name="firstName" className={inputClasses} />
                                        <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Прізвище</label>
                                        <Field name="lastName" className={inputClasses} />
                                        <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClasses}>Email</label>
                                    <Field name="email" type="email" className={inputClasses} />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div>
                                    <label className={labelClasses}>Phone</label>
                                    <Field name="phone" type="text" placeholder="+380xxxxxxxxx" className={inputClasses} />
                                    <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div>
                                    <label className={labelClasses}>Пароль</label>
                                    <Field name="password" type="password" className={inputClasses} />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div>
                                    <label className={labelClasses}>Підтвердження паролю</label>
                                    <Field name="confirmPassword" type="password" className={inputClasses} />
                                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors"
                                >
                                    {isSubmitting ? "Реєстрація..." : "Створити акаунт"}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Вже є акаунт? <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">Увійти</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}