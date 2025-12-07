export type Role = 'admin' | 'employee';

export interface TrackingRecord {
    id: string;
    awb_no: string;
    service_provider: string | null;
    sender: string | null;
    receiver: string | null;
    shipment_by: string | null;
    destination: string | null;
    weight_kg: number | null;
    contents: string | null;
    status: string | null;
    remarks: string | null;
    last_location: string | null;
    last_event_time: string | null;
    delivered: boolean;
    created_at: string;
}

export interface UserProfile {
    id: string;
    email: string;
    role: Role;
}
