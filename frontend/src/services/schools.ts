"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface School {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    address: string;
    note?: string;
    is_active: boolean;
    teacher_id: number;
    created_at?: string;
    updated_at?: string;
    username?: string;
    creator?: string;
    updater?: string;
    [key: string]: unknown;
}

export interface CreateSchoolPayload {
    name: string;
    phone?: string;
    email?: string;
    address: string;
    note?: string;
    is_active: boolean;
    teacher_id: number;
}

export interface UpdateSchoolPayload {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    note?: string;
    is_active?: boolean;
    teacher_id?: number;
}

export interface PaginatedSchools {
    schools: School[];
    total: number;
    page: number;
    pageSize: number;
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
 * Fetch schools. Supports pagination.
 */
export async function getAllSchools(page?: number, pageSize?: number, search?: string): Promise<ApiResponse<PaginatedSchools>> {
    const headers = await getAuthHeaders();
    try {
        let url = `${BASE_URL}/schools`;
        const params = new URLSearchParams();
        if (page !== undefined) params.set('page', String(page));
        if (pageSize !== undefined) params.set('pageSize', String(pageSize));
        if (search) params.set('search', search);
        const qs = params.toString();
        if (qs) url += `?${qs}`;
        const res = await fetch(url, {
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
    const headers = await getAuthHeaders();
    try {
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
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/schools`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.message || `Failed to create school: ${res.status} ${res.statusText}`);
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
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/schools/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.message || `Failed to update school ${id}: ${res.status} ${res.statusText}`);
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
    const headers = await getAuthHeaders();
    try {
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

// ─── Server Actions ──────────────────────────────────────────────────────────

export interface FormState {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
}

export async function createSchoolAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        const payload: CreateSchoolPayload = {
            name: formData.get("name") as string,
            phone: formData.get("phone") as string || undefined,
            email: formData.get("email") as string || undefined,
            address: formData.get("address") as string,
            note: formData.get("note") as string || undefined,
            is_active: formData.get("is_active") === "on",
            teacher_id: Number(formData.get("teacher_id")),
        };

        await createSchool(payload);
        return { success: true, message: "Trường học đã được tạo thành công" };
    } catch (error: any) {
        console.error("[createSchoolAction]", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi khi tạo trường học." };
    }
}

export async function updateSchoolAction(
    id: number,
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        const payload: UpdateSchoolPayload = {
            name: formData.get("name") as string || undefined,
            phone: formData.get("phone") as string || undefined,
            email: formData.get("email") as string || undefined,
            address: formData.get("address") as string || undefined,
            note: formData.get("note") as string || undefined,
            is_active: formData.get("is_active") === "on",
            teacher_id: Number(formData.get("teacher_id")) || undefined,
        };

        await updateSchool(id, payload);
        return { success: true, message: "Trường học đã được cập nhật thành công" };
    } catch (error: any) {
        console.error("[updateSchoolAction]", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi khi cập nhật trường học." };
    }
}

