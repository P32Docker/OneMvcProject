import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import APP_ENV from "../env";
import { Plus, Minus, Loader2, ShoppingCart} from 'lucide-react';
import type {ICart} from "../Interfaces/ICart.ts";

const Cart = () => {
    const api = `${APP_ENV.API_BASE_URL}/api`;
    const token = localStorage.getItem("token");
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<ICart[]>({
        queryKey: ["cart"],
        queryFn: async () => {
            const res = await axios.get(`${api}/Carts/GetList`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });
    const updateMutation = useMutation({
        mutationFn: async ({ id, quantity }: { id: number, quantity: number }) => {
            return axios.post(`${api}/Carts/AddUpdate`,
                { transportationId: id, quantity: quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: () => alert("Помилка оновлення кількості")
    });
    const handleQuantityChange = (id: number, currentQty: number, change: number) => {
        const newQty = currentQty + change;
        if (newQty < 1) return;
        updateMutation.mutate({ id, quantity: newQty });
    };

    const totalAmount = data?.reduce((sum: number, item: any) => {
        const price = item.transportation?.price || 0;
        return sum + (item.quantity * price);
    }, 0) || 0;

    if (isLoading) return <div className="flex justify-center mt-10"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="text-center mt-10 text-red-600">Помилка завантаження кошика</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl text-center font-bold mb-8 text-gray-800 flex items-center justify-center ">
                Кошик користувача
            </h1>

            {data && data.length > 0 ? (
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">

                    <div className="hidden md:flex bg-gray-50 p-4 font-semibold text-gray-500 border-b">
                        <div className="flex-1">Маршрут</div>
                        <div className="w-32 text-center">Ціна</div>
                        <div className="w-40 text-center">Кількість</div>
                        <div className="w-32 text-right">Сума</div>
                    </div>

                    {data.map((item) => (
                        <div key={item.id} className="flex flex-col md:flex-row items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">

                            <div className="flex-1 w-full md:w-auto mb-4 md:mb-0">
                                <h3 className="font-bold text-lg text-gray-800">
                                    {item.fromCityName} <span className="text-gray-400 mx-1">→</span> {item.toCityName}
                                </h3>
                                <div className="text-sm text-gray-500 flex gap-3 mt-1">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                        {item.departureTime}
                                    </span>
                                    <span>{item.seatsAvailable} місць вільно</span>
                                </div>
                            </div>
                            <div className="w-full md:w-32 text-left md:text-center text-gray-500 mb-2 md:mb-0">
                                грн
                            </div>

                            <div className="w-full md:w-40 flex justify-start md:justify-center items-center gap-3 mb-4 md:mb-0">
                                <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 active:scale-95 transition disabled:opacity-50"
                                    disabled={updateMutation.isPending || item.quantity <= 1}
                                >
                                    <Minus size={16} />
                                </button>

                                <span className="font-bold text-lg w-8 text-center text-gray-800">{item.quantity}</span>

                                <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600  rounded-lg hover:bg-gray-200 active:scale-95 transition disabled:opacity-50"
                                    disabled={updateMutation.isPending}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="w-full md:w-32 text-left md:text-right font-bold text-indigo-700  text-lg mb-2 md:mb-0">
                                грн
                            </div>
                        </div>
                    ))}

                    <div className="bg-gray-50 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-gray-500 font-medium">Всього до сплати:</span>
                            <span className="text-3xl font-bold text-indigo-700">{totalAmount} грн</span>
                        </div>
                        <button className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-xl transition-all transform active:scale-95">
                            Оформити замовлення
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="bg-gray-100 p-6 rounded-full mb-4">
                        <ShoppingCart size={48} className="text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700">Ваш кошик порожній</h2>
                    <p className="text-gray-500 mt-2">Виберіть рейси, щоб додати їх сюди.</p>
                </div>
            )}
        </div>
    );
};

export default Cart;