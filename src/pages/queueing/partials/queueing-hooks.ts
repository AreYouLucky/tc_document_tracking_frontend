import { useQuery } from "@tanstack/react-query";
import type { QueuesTransactionModel } from "../../../types/models";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_MAIN_URL;

export function useFetchCompleteQueues() {
    return useQuery<QueuesTransactionModel[]>({
        queryKey: ["services"],
        queryFn: async () => {
            const res = await axios.get(`${apiUrl}/api/get-transaction-status/completed`);
            return res.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false
    });
}