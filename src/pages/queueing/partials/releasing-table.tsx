import type React from "react";
import { useEffect, useRef, useState } from "react";
import { type QueuesTransactionModel } from "../../../types/models";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_MAIN_URL;

const ITEMS_PER_PAGE = 6;
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
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [speechQueue, setSpeechQueue] = useState<QueuesTransactionModel[]>([]);
    const [read, setRead] = useState({
        item: "",
        read: 0
    });

    const isSpeakingRef = useRef(false);
    const readCountsRef = useRef<Map<string, number>>(new Map());

    const parseDate = (date: string) => {
        return new Date(date).toLocaleString("en-PH", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getItemKey = (item: QueuesTransactionModel) => {
        return `${item.queue_id ?? "no-id"}-${item.queue_number ?? "no-number"}-${item.completed_at ?? "no-time"}`;
    };

    const fetchCurrentData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/api/get-transaction-status/completed`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const incomingData = Array.isArray(res.data) ? res.data : [];
            setData(incomingData);

            setSpeechQueue(prevQueue => {
                const queuedKeys = new Set(prevQueue.map(getItemKey));
                const newQueueItems = incomingData.filter(item => {
                    const itemKey = getItemKey(item);
                    return !queuedKeys.has(itemKey) && (readCountsRef.current.get(itemKey) ?? 0) < 2;
                });

                if (prevQueue.length === 0 && newQueueItems.length > 0) {
                    setRead({
                        item: "",
                        read: 0
                    });
                }

                return newQueueItems.length > 0 ? [...prevQueue, ...newQueueItems] : prevQueue;
            });
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
        const pickFemaleVoice = () => {
            const voices = speechSynthesis.getVoices();

            if (voices.length === 0) {
                return;
            }

            const femaleVoice =
                voices.find(voice =>
                    /female|zira|hazel|susan|aria|samantha|karen|moira|jenny/i.test(voice.name)
                ) ??
                voices.find(voice => /en-/i.test(voice.lang)) ??
                voices[0];

            setSelectedVoice(femaleVoice ?? null);
        };

        pickFemaleVoice();
        speechSynthesis.onvoiceschanged = pickFemaleVoice;

        return () => {
            speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    useEffect(() => {
        if (!data || data.length === 0) {
            setPaginatedData([]);
            setTotalPages(1);
            setCompleted(0);
            setCurrentPage(1);
            return;
        }

        const pages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
        setTotalPages(pages);
        setCompleted(data.length);

        const safePage = Math.min(currentPage, pages);
        if (safePage !== currentPage) {
            setCurrentPage(safePage);
            return;
        }

        const start = (safePage - 1) * ITEMS_PER_PAGE;
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

    useEffect(() => {
        if (speechQueue.length === 0 || isSpeakingRef.current) {
            if (speechQueue.length === 0 && read.read !== 2) {
                setRead(prev => ({
                    ...prev,
                    read: 2
                }));
            }
            return;
        }

        const currentItem = speechQueue[0];
        if (!currentItem) {
            return;
        }

        isSpeakingRef.current = true;

        const itemKey = getItemKey(currentItem);
        const speakCode = currentItem.queue_number?.split("").join(" ") ?? "";
        const speakText = `Queue Number ${speakCode} You may now get your request document at the releasing area.`;
        const utterance = new SpeechSynthesisUtterance(speakText);

        utterance.rate = 0.7;
        utterance.pitch = 1;
        utterance.volume = 1;

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        const handleFinish = () => {
            const nextReadCount = (readCountsRef.current.get(itemKey) ?? 0) + 1;
            readCountsRef.current.set(itemKey, nextReadCount);
            isSpeakingRef.current = false;

            setSpeechQueue(prevQueue => {
                if (prevQueue.length === 0) {
                    return prevQueue;
                }

                const [firstItem, ...rest] = prevQueue;

                if (nextReadCount < 2) {
                    return [...rest, firstItem];
                }

                return rest;
            });
        };

        utterance.onend = handleFinish;
        utterance.onerror = handleFinish;

        speechSynthesis.speak(utterance);
    }, [speechQueue, selectedVoice, read.read]);

    useEffect(() => {
        return () => {
            speechSynthesis.cancel();
        };
    }, []);

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
