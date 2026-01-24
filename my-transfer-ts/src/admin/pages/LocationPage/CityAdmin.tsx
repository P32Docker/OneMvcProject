import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import type {ICity} from "../../../Interfaces/ICity.ts";
import {useState} from "react";
import Modal from "./CityDetailed.tsx"
import APP_ENV from "../../../env";
import { Link } from "react-router-dom";


const CityAdmin = () => {

    const api = `${APP_ENV.API_BASE_URL}/api`;
    const [selected, setSelected] = useState<ICity | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    function openModal(item: ICity){
        setSelected(item);
        setIsOpen(true);
    }
    function closeModal(){
        setIsOpen(false);
        setSelected(null);
    }

    const {data, isLoading, error} = useQuery<ICity[]>({
        queryKey: ["cities"],
        queryFn: async () => {
            const res = await axios.get(api + "/cities");
            return res.data;
        }
    });
    console.log(data);

    if(error) return <p className={"text-4xl text-center text-red-800"}>Error loading Cities</p>
    if(isLoading) return <p className={"text-4xl text-center text-blue-500"}>Loading...</p>
    if(data === null) return <p className={"text-4xl text-center text-red-800"}>No cities found</p>

    return (
        <div className={"text-center"}>
            <Link
                to="/admin/location/cities/create"
                className="inline-block w-auto text-center min-w-[200px] px-6 py-4 text-white transition-all bg-green-600 dark:bg-white dark:text-green-700 rounded-md shadow-xl sm:w-auto hover:bg-green-900 hover:text-white shadow-neutral-300 dark:shadow-neutral-700 hover:shadow-2xl hover:shadow-neutral-400 hover:-tranneutral-y-px"
            >
                Add City
            </Link>
            <div className={"w-full p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>

                {
                    data?.map((item, index:number) => (
                        <div
                            key={index}
                            className="max-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-200"
                        >
                            <img
                                src={`${APP_ENV.API_BASE_URL}/images/${item.image}`}
                                alt={item.name}
                                className="w-full h-48 object-cover"
                            />

                            <div className="p-6 text-center">

                            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md">
                              {item.slug}
                            </span>

                                <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-300">
                                    {item.name}
                                </h3>

                                <p className="mt-1 text-gray-600 dark:text-gray-100 text-sm ">
                                    {item.country}
                                </p>
                                <button
                                    onClick={() => openModal(item)}
                                    className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
                                >
                                    Read more →
                                </button>


                            </div>
                        </div>
                    ))
                }
            </div>

            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                city={selected}
            />
        </div>
    )
}
export default CityAdmin;