"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Volunteer {
    id: number;
    full_name: string;
    phone: string;
    gender: string;
    address?: string;
    note?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    // Resolved by the backend (IDs replaced with string values)
    username?: string;
    creator?: string;
    updater?: string;
    [key: string]: unknown;
}

export interface PaginatedVolunteers {
    volunteers: Volunteer[];
    total: number;
    page: number;
    pageSize: number;
}

export interface CreateVolunteerPayload {
    account_id: number;
    full_name: string;
    phone: string;
    gender: string;
    address?: string;
    note?: string;
    is_active: boolean;
}

export interface UpdateVolunteerPayload {
    full_name?: string;
    phone?: string;
    gender?: string;
    address?: string;
    note?: string;
    is_active?: boolean;
}

export interface ApiResponse<T> {
    status: string;
    data: T;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getAuthHeaders(): Promise<HeadersInit> {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * GET /volunteers
 * Fetch all volunteers. Supports pagination.
 */
export async function getAllVolunteers(page?: number, pageSize?: number): Promise<ApiResponse<PaginatedVolunteers>> {
    const headers = await getAuthHeaders();
    try {
        let url = `${BASE_URL}/volunteers`;
        if (page !== undefined && pageSize !== undefined) {
            url += `?page=${page}&pageSize=${pageSize}`;
        }
        const res = await fetch(url, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch volunteers: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[getAllVolunteers]", error);
        throw error;
    }
}

/**
 * GET /volunteers/:id
 * Fetch a single volunteer by ID.
 */
export async function getVolunteerById(id: number): Promise<ApiResponse<Volunteer>> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/volunteers/${id}`, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch volunteer ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[getVolunteerById]", error);
        throw error;
    }
}

/**
 * POST /volunteers
 * Create a new volunteer.
 */
export async function createVolunteer(
    payload: CreateVolunteerPayload
): Promise<ApiResponse<Volunteer>> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/volunteers`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Failed to create volunteer: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[createVolunteer]", error);
        throw error;
    }
}

/**
 * PATCH /volunteers/:id
 * Partially update a volunteer.
 */
export async function updateVolunteer(
    id: number,
    payload: UpdateVolunteerPayload
): Promise<ApiResponse<Volunteer>> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/volunteers/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Failed to update volunteer ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[updateVolunteer]", error);
        throw error;
    }
}

/**
 * DELETE /volunteers/:id
 * Delete a volunteer.
 */
export async function deleteVolunteer(
    id: number
): Promise<{ status: string; message: string }> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/volunteers/${id}`, {
            method: "DELETE",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to delete volunteer ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[deleteVolunteer]", error);
        throw error;
    }
}

// ─── Server Actions ──────────────────────────────────────────────────────────

export interface FormState {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
}

export async function createVolunteerAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        const payload: CreateVolunteerPayload = {
            account_id: Number(formData.get("account_id")),
            full_name: formData.get("full_name") as string,
            phone: formData.get("phone") as string,
            gender: formData.get("gender") as string,
            address: formData.get("address") as string || undefined,
            note: formData.get("note") as string || undefined,
            is_active: formData.get("is_active") === "on",
        };

        await createVolunteer(payload);
        return { success: true, message: "Tình nguyện viên đã được tạo thành công" };
    } catch (error: any) {
        console.error("[createVolunteerAction]", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi khi tạo tình nguyện viên." };
    }
}

export async function updateVolunteerAction(
    id: number,
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        const payload: UpdateVolunteerPayload = {
            full_name: formData.get("full_name") as string || undefined,
            phone: formData.get("phone") as string || undefined,
            gender: formData.get("gender") as string || undefined,
            address: formData.get("address") as string || undefined,
            note: formData.get("note") as string || undefined,
            is_active: formData.get("is_active") === "on",
        };

        await updateVolunteer(id, payload);
        return { success: true, message: "Tình nguyện viên đã được cập nhật thành công" };
    } catch (error: any) {
        console.error("[updateVolunteerAction]", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi khi cập nhật tình nguyện viên." };
    }
}
