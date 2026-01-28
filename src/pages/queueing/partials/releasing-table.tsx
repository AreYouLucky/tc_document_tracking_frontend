import type React from "react";
import { useEffect, useState } from "react";
import { type QueuesTransactionModel } from "../../../types/models";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_MAIN_URL;

const ITEMS_PER_PAGE = 7;
const AUTO_CHANGE_SECONDS = 10;

function ReleasingTable({
    setCompleted,
}: {
    setCompleted: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [data, setData] = useState<QueuesTransactionModel[]>([]);
    const [paginatedData, setPaginatedData] = useState<QueuesTransactionModel[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [secondsLeft, setSecondsLeft] = useState(AUTO_CHANGE_SECONDS);
    const [animate, setAnimate] = useState(false);

    const parseDate = (date: string) => {
        return new Date(date).toLocaleString("en-PH", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    const fetchCurrentData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/api/get-transaction-status/completed`);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchCurrentData();
    }, []);

    useEffect(() => {
        if (data.length === 0) return;

        const pages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
        setTotalPages(pages);
        setCompleted(data.length);
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        setPaginatedData(data.slice(start, end));
    }, [data, currentPage, setCompleted]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    setCurrentPage(prevPage => {
                        setAnimate(true);
                        const nextPage = prevPage >= totalPages ? 1 : prevPage + 1;
                        if (prevPage >= totalPages) {
                            fetchCurrentData();
                        }
                        setAnimate(false);
                        return nextPage;
                    });
                    return AUTO_CHANGE_SECONDS;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [totalPages]);



    return (
        <div className="mt-2 bg-white shadow-sm border border-orange-200 overflow-hidden">

            <div className=" ">
                <table
                    className={`min-w-full text-sm transition-opacity duration-300 ${animate ? "opacity-0" : "opacity-100"
                        }`}
                >
                    <thead>
                        <tr>
                            <th className="px-6 py-4 text-center text-lg inter-bold uppercase bg-orange-500 text-white border-r">
                                Queue No.
                            </th>
                            <th className="px-6 py-4 text-center text-lg inter-bold uppercase bg-orange-500 text-white border-r">
                                Document Information
                            </th>
                            <th className="px-6 py-4 text-center text-lg inter-bold uppercase bg-orange-500 text-white">
                                Releasing Details
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedData.length ? (
                            paginatedData.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-100 last:border-b-0 hover:bg-orange-50/40 transition-colors"
                                >
                                    <td className="px-4 py-4 text-center inter-bold text-orange-600 text-xl">
                                        {item.queue_number}
                                    </td>

                                    <td className="px-4 py-4 align-top">
                                        <div className="flex flex-col">
                                            <p className="inter-bold text-slate-800 text-base">
                                                {item.service}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-medium">Client:</span>{" "}
                                                {item.client_name}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-medium">
                                                    Requesting Office:
                                                </span>{" "}
                                                {item.requesting_office}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 align-top text-gray-600">
                                        <p className="text-[15px] text-sky-600 inter-bold text-center">{item.current_step}</p>
                                        <p className="text-center">
                                            <span className="font-medium">
                                                Time:
                                            </span>{" "}
                                            {parseDate(item.completed_at as string)}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-4 py-6 text-center text-gray-500"
                                >
                                    {isLoading
                                        ? "Loading releasing queue..."
                                        : "No records found for releasing."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-600 border-t border-gray-100">
                    <span>
                        Page <span className="font-semibold">{currentPage}</span> of{" "}
                        <span className="font-semibold">{totalPages}</span>
                    </span>
                    <span>
                        Next page in{" "}
                        <span className="font-bold text-orange-600">
                            {secondsLeft}s
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ReleasingTable;
