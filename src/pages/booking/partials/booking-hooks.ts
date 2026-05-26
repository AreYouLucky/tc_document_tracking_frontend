import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { QueuesModel, ServicesModel } from "../../../types/models";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_MAIN_URL;

export type FormValueTypes = {
  client_name: string | null;
  sex?: string;
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

export type OfficeOption = {
  id: string;
  name: string;
  description?: string;
};

export type CheckOfficeBalancePayload = {
  officeId: string;
  pin: string;
};

export type BudgetResponse = {
  data: Office[];
  success: boolean;
  message: string;
};

export type Office = {
  id: number;
  name: string;
  address: string | null;
  contact_no: string | null;
  pin: number;
  created_at: string;
  updated_at: string;
  budget_monitoring: BudgetMonitoring[];
};

export type BudgetMonitoring = {
  id: number;
  office_id: number;
  allotment_class_id: number;
  appropriation: string;
  allotment: string;
  obligation: string;
  unobligated_balance: string;
  budget_date:string;
  created_at: string;
  updated_at: string;
  allotment_class: AllotmentClass;
};

export type AllotmentClass = {
  id: number;
  code: string;
  name: string;
  created_at: string | null;
  updated_at: string | null;
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const getValue = (value: unknown, keys: string[]): unknown => {
  if (!isRecord(value)) {
    return undefined;
  }

  for (const key of keys) {
    const candidate = value[key];
    if (candidate !== undefined && candidate !== null && candidate !== "") {
      return candidate;
    }
  }

  return undefined;
};

const getString = (value: unknown, keys: string[]): string | undefined => {
  const candidate = getValue(value, keys);

  if (typeof candidate === "string" && candidate.trim()) {
    return candidate.trim();
  }

  if (typeof candidate === "number") {
    return String(candidate);
  }

  return undefined;
};

const extractCollection = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!isRecord(value)) {
    return [];
  }

  const nestedCandidates = [value.data, value.offices, value.results, value.items];
  const match = nestedCandidates.find((candidate) => Array.isArray(candidate));

  return Array.isArray(match) ? match : [];
};

const normalizeOffice = (office: unknown): OfficeOption | null => {
  if (!isRecord(office)) {
    return null;
  }

  const name = getString(office, ["office_name", "name", "office", "label", "description"]);
  const id = getString(office, ["id", "office_id", "code", "value"]) ?? name;

  if (!name || !id) {
    return null;
  }

  const description = getString(office, ["code", "description"]);

  return {
    id,
    name,
    description,
  };
};

const isFailureResponse = (value: unknown, message?: string): boolean => {
  if (!isRecord(value)) {
    return false;
  }

  const successValue = value.success;
  if (typeof successValue === "boolean") {
    return !successValue;
  }

  const status = getString(value, ["status"]);
  if (status) {
    const normalizedStatus = status.toLowerCase();
    if (["error", "failed", "fail", "invalid", "unauthorized"].includes(normalizedStatus)) {
      return true;
    }
  }

  if (message) {
    const normalizedMessage = message.toLowerCase();
    if (normalizedMessage.includes("incorrect pin") || normalizedMessage.includes("invalid pin")) {
      return true;
    }
  }

  if (isRecord(value.data)) {
    const nestedMessage = getString(value.data, ["message"]);
    const nestedStatus = getString(value.data, ["status"]);

    if (nestedStatus && ["error", "failed", "fail", "invalid", "unauthorized"].includes(nestedStatus.toLowerCase())) {
      return true;
    }

    if (nestedMessage) {
      const normalizedNestedMessage = nestedMessage.toLowerCase();
      if (normalizedNestedMessage.includes("incorrect pin") || normalizedNestedMessage.includes("invalid pin")) {
        return true;
      }
    }
  }

  return false;
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

export function useFetchOffices() {
  return useQuery<OfficeOption[]>({
    queryKey: ["offices"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/api/load-offices`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const offices = extractCollection(res.data)
        .map(normalizeOffice)
        .filter((office): office is OfficeOption => office !== null);

      const uniqueOffices = new Map<string, OfficeOption>();
      for (const office of offices) {
        uniqueOffices.set(office.id, office);
      }

      return Array.from(uniqueOffices.values());
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
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

export function useCheckOfficeBalance() {
  return useMutation<BudgetResponse, AxiosError<ApiError>, CheckOfficeBalancePayload>({
    mutationFn: async (data) => {
      const res = await axios.get(`${apiUrl}/api/get-budget-monitoring`, {
        params: {
          office_id: data.officeId,
          pin: data.pin,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      const message =
        getString(res.data, ["message"]) ??
        (isRecord(res.data) ? getString(res.data.data, ["message"]) : undefined);

      if (isFailureResponse(res.data, message)) {
        throw new AxiosError(message ?? "Incorrect PIN");
      }

      const offices = extractCollection(res.data).filter((office): office is Office => {
        if (!isRecord(office)) {
          return false;
        }

        return typeof office.name === "string" && Array.isArray(office.budget_monitoring);
      });

      if (offices.length === 0) {
        throw new AxiosError(message ?? "Unable to read office balance.");
      }

      return {
        data: offices,
        success: true,
        message: message ?? "Budget retrieved successfully",
      };
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

export function useRequestOthers() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, FormData>({
    mutationFn: async (data) => {
      const res = await axios.post(`${apiUrl}/api/request-others`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queues"] });
    },
  });
}
