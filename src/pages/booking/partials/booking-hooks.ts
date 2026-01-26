import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { ServicesModel } from "../../../types/models";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_MAIN_URL;

export type FormValueTypes = {
    client_name: string | null;
    requesting_office: string | null;
    service_id: number | null;
};

type ApiOk = { status: string; data?: ServicesModel; errors: undefined, id?: number };
type ApiValidationErrors = Record<string, string[]>;
type ApiError = {
  message?: string;
  errors?: ApiValidationErrors;
};

export function useFetchServices() {
  return useQuery<ServicesModel[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/api/get-services`);
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
      const res = await axios.post(`${apiUrl}/api/create-booking`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queues"] });
    },
  });
}