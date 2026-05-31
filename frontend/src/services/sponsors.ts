"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Sponsor {
    id: number;
    full_name: string;
    phone: string;
    gender: string;
    address?: string;
    note?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    // Resolved by the backend from account_id / created_by / updated_by
    username?: string;   // linked account username
    creator?: string;    // username of the user who created this record
    updater?: string;    // username of the user who last updated this record
    [key: string]: unknown;
}

export interface CreateSponsorPayload {
    account_id: number;  // numeric FK sent to the backend on creation
    full_name: string;
    phone: string;
    gender: string;
    address?: string;
    note?: string;
    is_active: boolean;
}

export interface UpdateSponsorPayload {
    // account_id is not editable after creation
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

export interface PaginatedSponsors {
    sponsors: Sponsor[];
    total: number;
    page: number;
    pageSize: number;
}

/**
 * GET /sponsors
 * Fetch all sponsors. Supports pagination.
 */
export async function getAllSponsors(page?: number, pageSize?: number): Promise<ApiResponse<PaginatedSponsors | Sponsor[]>> {
    const headers = await getAuthHeaders();
    try {
        let url = `${BASE_URL}/sponsors`;
        if (page !== undefined && pageSize !== undefined) {
            url += `?page=${page}&pageSize=${pageSize}`;
        }
        const res = await fetch(url, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch sponsors: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[getAllSponsors]", error);
        throw error;
    }
}

/**
 * GET /sponsors/:id
 * Fetch a single sponsor by ID.
 */
export async function getSponsorById(id: number): Promise<ApiResponse<Sponsor>> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/sponsors/${id}`, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch sponsor ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[getSponsorById]", error);
        throw error;
    }
}

/**
 * POST /sponsors
 * Create a new sponsor.
 */
export async function createSponsor(
    payload: CreateSponsorPayload
): Promise<ApiResponse<Sponsor>> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/sponsors`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Failed to create sponsor: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[createSponsor]", error);
        throw error;
    }
}

/**
 * PATCH /sponsors/:id
 * Partially update a sponsor.
 */
export async function updateSponsor(
    id: number,
    payload: UpdateSponsorPayload
): Promise<ApiResponse<Sponsor>> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/sponsors/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Failed to update sponsor ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[updateSponsor]", error);
        throw error;
    }
}

/**
 * DELETE /sponsors/:id
 * Delete a sponsor.
 */
export async function deleteSponsor(
    id: number
): Promise<{ status: string; message: string }> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/sponsors/${id}`, {
            method: "DELETE",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to delete sponsor ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[deleteSponsor]", error);
        throw error;
    }
}

// ─── Server Actions ──────────────────────────────────────────────────────────

export interface FormState {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
}

export async function createSponsorAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        const payload: CreateSponsorPayload = {
            account_id: Number(formData.get("account_id")),
            full_name: formData.get("full_name") as string,
            phone: formData.get("phone") as string,
            gender: formData.get("gender") as string,
            address: formData.get("address") as string || undefined,
            note: formData.get("note") as string || undefined,
            is_active: formData.get("is_active") === "on",
        };

        await createSponsor(payload);
        return { success: true, message: "Nhà tài trợ đã được tạo thành công" };
    } catch (error: any) {
        console.error("[createSponsorAction]", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi khi tạo nhà tài trợ." };
    }
}

export async function updateSponsorAction(
    id: number,
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        const payload: UpdateSponsorPayload = {
            full_name: formData.get("full_name") as string || undefined,
            phone: formData.get("phone") as string || undefined,
            gender: formData.get("gender") as string || undefined,
            address: formData.get("address") as string || undefined,
            note: formData.get("note") as string || undefined,
            is_active: formData.get("is_active") === "on",
        };

        await updateSponsor(id, payload);
        return { success: true, message: "Nhà tài trợ đã được cập nhật thành công" };
    } catch (error: any) {
        console.error("[updateSponsorAction]", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi khi cập nhật nhà tài trợ." };
    }
}
