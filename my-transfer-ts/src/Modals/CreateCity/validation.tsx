import * as yup from 'yup';

export const createCitySchema = yup.object({
    name: yup.string()
        .required("Назва міста не може бути порожньою")
        .max(100, "Назва міста не може перевищувати 100 символів"),
    slug: yup.string()
        .required("Slug міста не може бути порожнім")
        .max(100, "Slug міста не може перевищувати 100 символів"),
    countryId: yup.string().required("Виберіть країну"),
    description: yup.string().default(""),
    image: yup
        .mixed()
        .test("required", "Виберіть зображення", (value) => {
            const files = value as FileList;

            return files && files.length > 0;
        })
});
export type ICityForm = yup.InferType<typeof createCitySchema>;