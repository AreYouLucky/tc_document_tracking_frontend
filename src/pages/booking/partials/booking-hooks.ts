import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { QueuesModel, ServicesModel } from "../../../types/models";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_MAIN_URL;

export type FormValueTypes = {
  client_name: string | null;
  requesting_office: string | null;
  position?: string;
  contact_no?: string;
  purpose?: string;
  service_id: number | null;
  queue_number: string | null;
  currentDate?: string;
  type: number;
};

type ApiOk = { status: string; data?: QueuesModel; errors: undefined; queue_number: string };
type ApiValidationErrors = Record<string, string[]>;
type ApiError = {
  message?: string;
  errors?: ApiValidationErrors;
};

export function useFetchServices() {
  return useQuery<ServicesModel[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/api/get-services`, {
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
export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, FormData>({
    mutationFn: async (data) => {
      const res = await axios.post(`${apiUrl}/api/queue`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queues"] });
    },
  });
}

export function useRequestCoa() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, FormData>({
    mutationFn: async (data) => {
      const res = await axios.post(`${apiUrl}/api/request-ca`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queues"] });
    },
  });
}