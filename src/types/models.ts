export type ServicesModel = {
    id: number | null;
    code: string | null;
    name: string | null;
    slug: string | null;
    description: string | null;
}

export type QueuesModel = {
    queue_number?: string;
    id: number | null;
    service_id: number | null;
    client_name: string | null;
    status: string | null;
    requesting_office: string | null;
}

export type QueuesTransactionModel = {
    queue_id: number | null;
    queue_number: string | null;
    reference_no: string | null;
    client_name: string | null;
    status: string | null;
    priority: string | null;
    service: string | null;
    current_step: string | null;
    requesting_office: string | null;
    completed_at: string | null;
}
