import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import APP_ENV from "../../../env";
import type {ITransportation} from "../../../Interfaces/ITransportation.ts";
import {Check, Loader2, ShoppingCart} from 'lucide-react';
import {useAppSelector} from "../../../store";
import {useState} from "react";

const Transportation = () => {

    const api = `${APP_ENV.API_BASE_URL}/api`;
    const token = localStorage.getItem("token");
    const user = useAppSelector(redux => redux.auth.user);
    const [addedIds, setAddedIds] = useState<number[]>([]);

    const [loadingId, setLoadingId] = useState<number | null>(null);
    const {data, isLoading, error} = useQuery<ITransportation[]>({
        queryKey: ["transportation"],
        queryFn: async () => {
            const res = await axios.get(api + "/transportation/GetList");
            return res.data;
        }
    });

    const handleAddToCart = async (id: number) => {
        if (user == null) {
            alert("Будь ласка, авторизуйтесь для покупки!");
            return;
        }
        if (addedIds.includes(id)) return;
        setLoadingId(id);
        try {
            await axios.post(
                `${api}/Carts/AddUpdate`,
                { transportationId: id, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAddedIds(prev => [...prev, id]);

        } catch (err) {
            console.error(err);
            alert("Помилка при додаванні");
        } finally {
            setLoadingId(null);
        }
    };
    console.log(data);

    if(error) return <p className={"text-4xl text-center text-red-800 dark:text-red-400"}>Error loading items</p>
    if(isLoading) return <p className={"text-4xl text-center text-blue-500 dark:text-blue-400"}>Loading...</p>
    if(data === null) return <p className={"text-4xl text-center text-red-800 dark:text-red-400"}>No transportations found</p>

    return (
        <div className="text-center flex items-center justify-center p-4">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data?.map((item) => {
                    const isAdded = addedIds.includes(item.id);

                    return (
                        <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 flex flex-col justify-between h-full text-left hover:shadow-md transition-all duration-200">

                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-gray-900 dark:text-white">{item.fromCityName}</h3>
                                    <span className="text-gray-400 dark:text-gray-500">→</span>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{item.toCityName}</h3>
                                </div>
                                {/* Час: світлий фон для світлої теми, темний для темної */}
                                <div className="text-sm text-gray-500 dark:text-gray-300 text-center bg-gray-50 dark:bg-gray-700 rounded py-1">
                                    {item.departureTime} — {item.arrivalTime}
                                </div>
                            </div>

                            <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">

                                {loadingId === item.id ? (
                                    <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={24} />
                                ) : isAdded ? (
                                    <button
                                        disabled
                                        className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-lg cursor-default transition-all"
                                    >
                                        <Check size={18} />
                                        <span className="text-sm font-bold">В кошику</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleAddToCart(item.id)}
                                        className="p-2 text-gray-400 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-full transition-colors"
                                        title="Додати в кошик"
                                    >
                                        <ShoppingCart size={24} />
                                    </button>
                                )}
                                <div className="text-sm text-center">
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-center">{item.seatsAvailable}</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-center"> / {item.seatsTotal} місць</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
export default Transportation;