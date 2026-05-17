"use server";

import { cookies } from "next/headers";

const BASE_URL = "http://localhost:5001";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface School {
    id: number;
    name: string;
    address: string;
    teacher_id: number;
    [key: string]: unknown;
}

export interface CreateSchoolPayload {
    name: string;
    address: string;
    teacher_id: number;
}

export interface UpdateSchoolPayload {
    name?: string;
    address?: string;
    teacher_id?: number;
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
 * GET /schools
 * Fetch all schools.
 */
export async function getAllSchools(): Promise<ApiResponse<School[]>> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/schools`, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch schools: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[getAllSchools]", error);
        throw error;
    }
}

/**
 * GET /schools/:id
 * Fetch a single school by ID.
 */
export async function getSchoolById(id: number): Promise<ApiResponse<School>> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/schools/${id}`, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch school ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[getSchoolById]", error);
        throw error;
    }
}

/**
 * POST /schools
 * Create a new school.
 */
export async function createSchool(
    payload: CreateSchoolPayload
): Promise<ApiResponse<School>> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/schools`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Failed to create school: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[createSchool]", error);
        throw error;
    }
}

/**
 * PATCH /schools/:id
 * Partially update a school.
 */
export async function updateSchool(
    id: number,
    payload: UpdateSchoolPayload
): Promise<ApiResponse<School>> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/schools/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Failed to update school ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[updateSchool]", error);
        throw error;
    }
}

/**
 * DELETE /schools/:id
 * Delete a school.
 */
export async function deleteSchool(
    id: number
): Promise<{ status: string; message: string }> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/schools/${id}`, {
            method: "DELETE",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to delete school ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[deleteSchool]", error);
        throw error;
    }
}
