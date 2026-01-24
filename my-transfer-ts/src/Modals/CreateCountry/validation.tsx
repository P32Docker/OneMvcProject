import * as yup from 'yup';

export const createCountrySchema = yup.object({
    name: yup.string()
        .required("Назва країни не може бути порожньою")
        .max(100, "Назва країни не може перевищувати 100 символів"),
    slug: yup.string()
        .required("Slug країни не може бути порожнім")
        .max(100, "Slug країни не може перевищувати 100 символів"),
    code: yup.string().required("Код країни не може бути порожнім"),
    image: yup
        .mixed()
        .test("required", "Виберіть зображення", (value) => {
            const files = value as FileList;

            return files && files.length > 0;
        })
});
export type ICountryForm = yup.InferType<typeof createCountrySchema>;