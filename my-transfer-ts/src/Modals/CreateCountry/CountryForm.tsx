import {ErrorMessage, Field, type FieldProps, Form, Formik, type FormikHelpers} from "formik";
import {useNavigate} from "react-router-dom";
import type {ICountryFormCreate} from "../../Interfaces/ICountryFormCreate.ts";
import axios from "axios";
import APP_ENV from "../../env";
import {createCountrySchema} from "./validation.tsx";
import slugify from "slugify";

const CreateCountry = () => {
    const navigate = useNavigate();
    const initialValues: ICountryFormCreate = {
        name: '',
        slug: '',
        code: '',
        image: null
    };
    const onSubmit = async (
        values: ICountryFormCreate,
        { setSubmitting }: FormikHelpers<ICountryFormCreate>
    ) => {
        const formData = new FormData();
        formData.append('Name', values.name);
        formData.append('Slug', values.slug);
        formData.append('Code', values.code);

        if (values.image) {
            formData.append('Image', (values.image as FileList)[0]);
        }

        try {
            await axios.post(`${APP_ENV.API_BASE_URL}/api/countries`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate("/admin/location/countries");
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300">Створити країну</h1>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="bg-white dark:bg-gray-700 py-8 px-4 shadow sm:rounded-lg sm:px-10">

                    <Formik
                        initialValues={initialValues}
                        createCountrySchema={createCountrySchema}
                        onSubmit={onSubmit}
                    >
                        {({ setFieldValue, isSubmitting }) => (
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
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Code</label>
                                    <Field
                                        name="code"
                                        type="text"
                                        className="mt-1 block w-full border border-gray-300 dark:text-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <ErrorMessage name="code" component="div" className="text-red-500 text-xs mt-1" />
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

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                    {isSubmitting ? "Збереження..." : "Створити країну"}
                                </button>

                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>

    )
}
export default CreateCountry;