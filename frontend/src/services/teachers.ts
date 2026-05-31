"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Teacher {
    id: number;
    full_name: string;
    phone: string;
    gender: string;
    address?: string;
    note?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    // Resolved by the backend
    username?: string;
    school?: string;
    creator?: string;
    updater?: string;
    [key: string]: unknown;
}

export interface CreateTeacherPayload {
    account_id: number;
    school_id: number;
    full_name: string;
    phone: string;
    gender: string;
    address?: string;
    note?: string;
    is_active: boolean;
}

export interface UpdateTeacherPayload {
    school_id?: number;
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

export interface PaginatedTeachers {
    teachers: Teacher[];
    total: number;
    page: number;
    pageSize: number;
}

/**
 * GET /teachers
 * Fetch all teachers. Supports pagination.
 */
export async function getAllTeachers(page?: number, pageSize?: number): Promise<ApiResponse<PaginatedTeachers | Teacher[]>> {
    try {
        const headers = await getAuthHeaders();
        let url = `${BASE_URL}/teachers`;
        if (page !== undefined && pageSize !== undefined) {
            url += `?page=${page}&pageSize=${pageSize}`;
        }
        const res = await fetch(url, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch teachers: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[getAllTeachers]", error);
        throw error;
    }
}

/**
 * GET /teachers/:id
 * Fetch a single teacher by ID.
 */
export async function getTeacherById(id: number): Promise<ApiResponse<Teacher>> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/teachers/${id}`, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch teacher ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[getTeacherById]", error);
        throw error;
    }
}

/**
 * POST /teachers
 * Create a new teacher.
 */
export async function createTeacher(
    payload: CreateTeacherPayload
): Promise<ApiResponse<Teacher>> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/teachers`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Failed to create teacher: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[createTeacher]", error);
        throw error;
    }
}

/**
 * PATCH /teachers/:id
 * Partially update a teacher.
 */
export async function updateTeacher(
    id: number,
    payload: UpdateTeacherPayload
): Promise<ApiResponse<Teacher>> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/teachers/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Failed to update teacher ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[updateTeacher]", error);
        throw error;
    }
}

/**
 * DELETE /teachers/:id
 * Delete a teacher.
 */
export async function deleteTeacher(
    id: number
): Promise<{ status: string; message: string }> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/teachers/${id}`, {
            method: "DELETE",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to delete teacher ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[deleteTeacher]", error);
        throw error;
    }
}

// ─── Server Actions ──────────────────────────────────────────────────────────

export interface FormState {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
}

export async function createTeacherAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        const payload: CreateTeacherPayload = {
            account_id: Number(formData.get("account_id")),
            school_id: Number(formData.get("school_id")),
            full_name: formData.get("full_name") as string,
            phone: formData.get("phone") as string,
            gender: formData.get("gender") as string,
            address: formData.get("address") as string || undefined,
            note: formData.get("note") as string || undefined,
            is_active: formData.get("is_active") === "on",
        };

        await createTeacher(payload);
        return { success: true, message: "Giáo viên đã được tạo thành công" };
    } catch (error: any) {
        console.error("[createTeacherAction]", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi khi tạo giáo viên." };
    }
}

export async function updateTeacherAction(
    id: number,
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        const payload: UpdateTeacherPayload = {
            school_id: Number(formData.get("school_id")),
            full_name: formData.get("full_name") as string || undefined,
            phone: formData.get("phone") as string || undefined,
            gender: formData.get("gender") as string || undefined,
            address: formData.get("address") as string || undefined,
            note: formData.get("note") as string || undefined,
            is_active: formData.get("is_active") === "on",
        };

        await updateTeacher(id, payload);
        return { success: true, message: "Giáo viên đã được cập nhật thành công" };
    } catch (error: any) {
        console.error("[updateTeacherAction]", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi khi cập nhật giáo viên." };
    }
}
