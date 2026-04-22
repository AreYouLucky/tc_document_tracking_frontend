import { useQuery } from "@tanstack/react-query";
import type { QueuesTransactionModel } from "../../../types/models";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_MAIN_URL;

export function useFetchCompleteQueues() {
    return useQuery<QueuesTransactionModel[]>({
        queryKey: ["services"],
        queryFn: async () => {
            const res = await axios.get(`${apiUrl}/api/get-transaction-status/completed`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return res.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false
    });
}


export const getItemIdentityKey = (item: QueuesTransactionModel) => {
    return `${item.queue_id ?? item.reference_no ?? "no-id"}-${item.queue_number ?? "no-number"}`;
};

export const getItemKey = (item: QueuesTransactionModel) => {
    return [
        getItemIdentityKey(item),
        item.status ?? "no-status",
        item.current_step ?? "no-step",
        item.completed_at ?? "no-time",
    ].join("-");
};

const formatQueueNumber = (queueNumber: string | null) => {
    return queueNumber?.split("").join(" ") ?? "";
};

export const getQueueNumberTextClass = (queueNumber: string | null) => {
    const length = queueNumber?.trim().length ?? 0;

    if (length >= 12) {
        return "text-3xl md:text-5xl lg:text-5xl";
    }

    if (length >= 7) {
        return "text-5xl md:text-6xl lg:text-6xl";
    }

    return "text-6xl md:text-7xl lg:text-[5rem]";
};

export const buildSpeechText = (item: QueuesTransactionModel) => {
    const speakCode = formatQueueNumber(item.queue_number);
    const currentStep = item.current_step?.trim();
    const status = item.status?.toLowerCase();

    if (status === "completed" || item.completed_at) {
        return `Queue Number ${speakCode} is now ready for releasing. You may get your requested document at the releasing area.`;
    }

    if (currentStep) {
        return `Queue Number ${speakCode} is now at ${currentStep}.`;
    }

    return `Queue Number ${speakCode} has been updated.`;
};
