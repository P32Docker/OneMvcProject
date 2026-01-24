import type { ICity } from "../Interfaces/ICity";
import APP_ENV from "../env";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    city: ICity | null;
}

export default function City({ isOpen, onClose, city }: ModalProps) {
    if (!isOpen || !city) return null;

    const url = `${APP_ENV.API_BASE_URL}`;

    return (
        <div className="fixed inset-0 bg-black/40  flex items-center justify-center z-50"
             onClick={onClose}
        >
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                >
                    ×
                </button>

                <img
                    src={`${url}/images/${city.image}`}
                    alt={city.name}
                    className="w-full h-56 object-cover rounded-lg"
                />
                <div
                    className="mt-4 text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: city.description }}
                />



            </div>
        </div>
    );
}