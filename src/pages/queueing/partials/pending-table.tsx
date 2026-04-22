import type React from "react";
import { useEffect, useState } from "react";
import { type QueuesTransactionModel } from "../../../types/models";
import axios from "axios";
import { getQueueNumberTextClass } from "./queueing-hooks";
const apiUrl = import.meta.env.VITE_API_MAIN_URL;

const ITEMS_PER_PAGE = 3;
const AUTO_CHANGE_SECONDS = 10;

function PendingTable({
    pending,
    setPending,
}: {
    pending: QueuesTransactionModel[];
    setPending: React.Dispatch<React.SetStateAction<QueuesTransactionModel[]>>;
}) {
    const [paginatedData, setPaginatedData] = useState<QueuesTransactionModel[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [secondsLeft, setSecondsLeft] = useState(AUTO_CHANGE_SECONDS);
    const [animate, setAnimate] = useState(false);

    const fetchCurrentData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/api/get-transaction-waiting-processing`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const incomingData = Array.isArray(res.data) ? res.data : [];
            setPending(incomingData);
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
        if (!pending || pending.length === 0) {
            setPaginatedData([]);
            setTotalPages(1);
            setCurrentPage(1);
            return;
        }

        const pages = Math.max(1, Math.ceil(pending.length / ITEMS_PER_PAGE));
        setTotalPages(pages);

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        setPaginatedData(pending.slice(start, end));
    }, [pending, currentPage, setPending]);

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
                    className={`min-w-full table-fixed text-sm transition-opacity duration-300 ${animate ? "opacity-0" : "opacity-100"
                        }`}
                >
                    <thead>
                        <tr>
                            <th className="w-[58%] px-6 py-5 text-center text-xl inter-bold uppercase bg-orange-500 text-white border-r border-orange-300">
                                Queue No.
                            </th>
                            <th className="w-[42%] px-6 py-5 text-center text-xl inter-bold uppercase bg-orange-500 text-white">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedData.length ? (
                            paginatedData.map((item, index) => (
                                <tr
                                    key={index}
                                    className=" last:border-b-0 hover:bg-orange-50/40 transition-colors"
                                >
                                    <td className="px-10 py-7 text-start text-orange-600 border-r border-slate-200">
                                        <p className={`inter-bold leading-none tracking-[0.05em] ${getQueueNumberTextClass(item.queue_number)}`}>
                                            {item.queue_number}
                                        </p>
                                        <p className="mt-3 text-2xl text-gray-700 inter-semibold leading-tight">
                                            {item.service}
                                        </p>
                                    </td>
                                    <td className="px-6 py-7 align-middle text-gray-600">
                                        <p className={` ${item.status === "processing" ? "text-sky-600" : "text-orange-600"} text-4xl inter-bold text-center uppercase leading-tight`}>
                                            {item.status}
                                        </p>
                                        <p className="mt-2 text-2xl text-slate-800 inter-semibold text-center leading-snug">
                                            {item.current_step}
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
                <div className="flex justify-between items-center px-5 py-3 text-lg text-gray-600 border-t border-gray-100">
                    <span>
                        Page <span className="font-semibold">{currentPage}</span> of{" "}
                        <span className="font-semibold">{totalPages}</span>
                    </span>
                    <span>
                        Next page in{" "}
                        <span className="font-bold text-orange-600 text-2xl">
                            {secondsLeft}s
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default PendingTable;
