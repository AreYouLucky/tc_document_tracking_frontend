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