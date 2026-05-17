"use server";

import { cookies } from "next/headers";

const BASE_URL = "http://localhost:5001";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Sponsor {
    id: number;
    name: string;
    contact_info: string;
    status_id: number;
    volunteer_id: number;
    [key: string]: unknown;
}

export interface CreateSponsorPayload {
    name: string;
    contact_info: string;
    status_id: number;
    volunteer_id: number;
}

export interface UpdateSponsorPayload {
    name?: string;
    contact_info?: string;
    status_id?: number;
    volunteer_id?: number;
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
 * GET /sponsors
 * Fetch all sponsors.
 */
export async function getAllSponsors(): Promise<ApiResponse<Sponsor[]>> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/sponsors`, {
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
    try {
        const headers = await getAuthHeaders();
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
    try {
        const headers = await getAuthHeaders();
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
    try {
        const headers = await getAuthHeaders();
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
    try {
        const headers = await getAuthHeaders();
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
