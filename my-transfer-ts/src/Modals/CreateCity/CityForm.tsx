import { useEffect, useState } from 'react';
import {Formik, Form, Field, ErrorMessage, type FormikHelpers, type FieldProps} from 'formik';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import APP_ENV from '../../env';
import type { ICountry } from '../../Interfaces/ICountry';
import slugify from "slugify";
import type {ICityFormCreate} from "../../Interfaces/ICityFormCreate";
import {createCitySchema} from "./validation"
import "./Editor.css"
const CreateCity = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        const checkDarkMode = () => {
            const hasDarkClass = document.documentElement.classList.contains('dark');
            const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(hasDarkClass || systemPrefersDark);
        };

        checkDarkMode();

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemChange = (e: MediaQueryListEvent) => {
            if (!document.documentElement.classList.contains('dark')) {
                setIsDark(e.matches);
            }
        };
        mediaQuery.addEventListener('change', handleSystemChange);

        return () => {
            observer.disconnect();
            mediaQuery.removeEventListener('change', handleSystemChange);
        };
    }, []);
    useEffect(() => {
        axios.get(`${APP_ENV.API_BASE_URL}/api/countries`)
            .then(res => setCountries(res.data));
    }, []);

    const initialValues: ICityFormCreate = {
        name: '',
        slug: '',
        countryId: '',
        description: '',
        image: null
    };

    const onSubmit = async (
        values: ICityFormCreate,
        { setSubmitting }: FormikHelpers<ICityFormCreate>
    ) => {
        const formData = new FormData();
        formData.append('Name', values.name);
        formData.append('Slug', values.slug);
        formData.append('Description', values.description);
        formData.append('CountryId', values.countryId);

        if (values.image) {
            formData.append('Image', (values.image as FileList)[0]);
        }

        try {
            await axios.post(`${APP_ENV.API_BASE_URL}/api/cities`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate("/admin/location/cities");
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300">Створити місто</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="bg-white dark:bg-gray-700 py-8 px-4 shadow sm:rounded-lg sm:px-10">

                    <Formik
                        initialValues={initialValues}
                        createCitySchema={createCitySchema}
                        onSubmit={onSubmit}
                    >
                        {({ setFieldValue, values, isSubmitting }) => (
                            <Form className="space-y-6">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Назва</label>
                                    <Field name="name">
                                        {({ field }: FieldProps) => (
                                            <input
                                                {...field}
                                                type="text"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-gray-300"
                                                onChange={(e) => {
                                                    field.onChange(e);

                                                    const val = e.target.value;

                                                    const newSlug = slugify(val, {
                                                        lower: true,
                                                        strict: true,
                                                        locale: 'uk'
                                                    });

                                                    setFieldValue("slug", newSlug);
                                                }}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug</label>
                                    <Field
                                        name="slug"
                                        type="text"
                                        className="mt-1 block w-full border border-gray-300 dark:text-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <ErrorMessage name="slug" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Країна</label>
                                    <Field as="select" name="countryId" className="mt-1 block w-full bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option className={"dark:text-gray-300"}  value="">Оберіть країну</option>
                                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </Field>
                                    <ErrorMessage name="countryId" component="div" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Фото</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            setFieldValue("image", event.currentTarget.files);
                                        }}
                                        className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-gray-700 file:border-white file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100"
                                    />
                                    <ErrorMessage name="image" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Опис</label>
                                    <Editor
                                        key={isDark ? "dark" : "light"}
                                        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                                        value={values.description}
                                        init={{skin: isDark ? "oxide-dark" : "oxide", content_css: isDark ? "dark" : "default",height: 300, menubar: false, toolbar: 'undo redo | bold italic underline | h1 h2 h3 | fontfamily styles',  }}
                                        onEditorChange={(content) => {
                                            setFieldValue("description", content);
                                        }}

                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                    {isSubmitting ? "Збереження..." : "Створити місто"}
                                </button>

                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default CreateCity;