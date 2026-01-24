import React, { useState } from 'react';
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Search,ChevronLeft, ChevronRight, X, User as UserIcon, Loader2 } from 'lucide-react';
import type { ISearchUsers } from "../Interfaces/ISearchUsers";
import { searchUsers } from "../services/accountService";
import APP_ENV from "../env";

const SearchUsers = () => {
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        name: '',
        startDate: '',
        endDate: ''
    });
    const baseUrl = APP_ENV.API_BASE_URL;
    const [activeFilters, setActiveFilters] = useState({
        name: '',
        startDate: '',
        endDate: ''
    });
    const searchParams: ISearchUsers = {
        page: page,
        itemPerPage: itemsPerPage,
        ...activeFilters
    };
    const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
        queryKey: ['users', searchParams],
        queryFn: () => searchUsers(searchParams),
        placeholderData: keepPreviousData,
        staleTime: 5000,
    });

    const users = data?.items || [];
    const pagination = data?.pagination || { totalCount: 0, totalPages: 0, currentPage: 1, itemsPerPage: 10 };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setActiveFilters(filters);
    };

    const handleClearFilters = () => {
        const empty = { name: '', startDate: '', endDate: '' };
        setFilters(empty);
        setActiveFilters(empty);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPage(newPage);
        }
    };
    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto ">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Користувачі</h1>
                    <p className="text-gray-500 mt-2">Пошук</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 grid place-items-center">
                    <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">

                        <div className="md:col-span-4 ">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ім'я або Прізвище</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={filters.name}
                                    onChange={handleInputChange}
                                    placeholder="Введіть ім'я..."
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                Пошук
                            </button>
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 py-2.5 px-3 rounded-lg transition-colors"
                                title="Очистити"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[300px]">

                    {isPlaceholderData && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-100 overflow-hidden z-10">
                            <div className="h-full bg-blue-500 animate-pulse w-full"></div>
                        </div>
                    )}

                    {isLoading && !isPlaceholderData ? (
                        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-20">
                            <div className="flex flex-col items-center text-gray-500">
                                <Loader2 className="animate-spin mb-2" size={32} />
                                <span>Завантаження даних...</span>
                            </div>
                        </div>
                    ) : isError ? (
                        <div className="p-12 flex flex-col justify-center items-center text-red-500 bg-red-50 h-full">
                            <p className="font-medium text-lg mb-2">Помилка завантаження</p>
                            <p className="text-sm">{(error as Error).message || 'Щось пішло не так'}</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                            <UserIcon size={48} className="text-gray-300 mb-3" />
                            <p className="text-lg font-medium">Користувачів не знайдено</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                        <th className="px-6 py-4">Користувач</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Телефон</th>
                                        <th className="px-6 py-4">Ролі</th>
                                    </tr>
                                    </thead>
                                    <tbody className={`divide-y divide-gray-100 transition-opacity duration-200 ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
                                    {users.map((user, idx) => (
                                        <tr key={user.id || idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {user.image ? (
                                                            <img
                                                                src={user.image ? (user.image.startsWith('http') ? user.image : `${baseUrl}/images/${user.image}`) : "images (8).png"}
                                                                alt="avatar"
                                                                className="h-8 w-8 rounded-full object-cover border-2 border-white"
                                                                onError={(e) => {
                                                                    e.currentTarget.onerror = null;
                                                                    e.currentTarget.src = "images (8).png";
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.fullName || 'Без імені'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles && user.roles.map((role, rIdx) => (
                                                        <span key={rIdx} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                                                {role}
                                                            </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Показано <span className="font-medium">{users.length}</span> з <span className="font-medium">{pagination.totalCount}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1 || isLoading}
                                        className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <span className="text-sm font-medium text-gray-700 px-2">
                                        Сторінка {page} з {pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === pagination.totalPages || isLoading}
                                        className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
export default SearchUsers;