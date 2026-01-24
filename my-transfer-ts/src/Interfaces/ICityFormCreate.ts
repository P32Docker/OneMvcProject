export interface ICityFormCreate{
    name: string;
    slug: string;
    countryId: string;
    description: string;
    image: FileList | null;
}