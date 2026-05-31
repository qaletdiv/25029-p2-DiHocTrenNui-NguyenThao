"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Student {
    id: string;
    full_name: string;
    date_of_birth: string;
    gender: string;
    phone: string;
    grade: string;
    family_condition: string;
    monthly_amount: number;
    avatar_url: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    address: string;
    school: string;
    status: string;
    creator: string;
    updater: string;
    [key: string]: unknown;
}

export interface CreateStudentPayload {
    full_name: string;
    date_of_birth: string;
    gender: string;
    phone: string;
    grade: string;
    family_condition: string;
    monthly_amount?: number;
    is_active: boolean;
    address: string;
    school: string;
    status: string;
}

export interface UpdateStudentPayload {
    full_name?: string;
    date_of_birth?: string;
    gender?: string;
    phone?: string;
    grade?: string;
    family_condition?: string;
    monthly_amount?: number;
    is_active?: boolean;
    address?: string;
    school?: string;
    status?: string;
    sponsor_id?: number | null;
    teacher_id?: number | null;
    volunteer_id?: number | null;
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

export interface PaginatedStudents {
    students: Student[];
    total: number;
    page: number;
    pageSize: number;
}

/**
 * GET /students
 * Fetch all students. Supports pagination, search, and status filtering.
 */
export async function getAllStudents(
    page?: number,
    pageSize?: number,
    search?: string,
    status?: string
): Promise<ApiResponse<PaginatedStudents | Student[]>> {
    const headers = await getAuthHeaders();
    try {
        const params = new URLSearchParams();
        if (page !== undefined) params.set('page', String(page));
        if (pageSize !== undefined) params.set('pageSize', String(pageSize));
        if (search) params.set('search', search);
        if (status) params.set('status', status);

        const queryString = params.toString();
        const url = `${BASE_URL}/students${queryString ? `?${queryString}` : ''}`;
        const res = await fetch(url, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch students: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[getAllStudents]", error);
        throw error;
    }
}

/**
 * GET /students/:id
 * Fetch a single student by ID.
 */
export async function getStudentById(id: string): Promise<ApiResponse<Student>> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/students/${id}`, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch student ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[getStudentById]", error);
        throw error;
    }
}

/**
 * POST /students
 * Create a new student.
 */
export async function createStudent(
    payload: CreateStudentPayload
): Promise<ApiResponse<Student>> {
    const headers = await getAuthHeaders();
    try {
        console.log("payload create student:", payload);

        const res = await fetch(`${BASE_URL}/students`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Failed to create student: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[createStudent]", error);
        throw error;
    }
}

export interface FormState {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
}

export async function createStudentAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        const payload: CreateStudentPayload = {
            full_name: formData.get("full_name") as string,
            date_of_birth: formData.get("date_of_birth") as string,
            gender: formData.get("gender") as string,
            phone: formData.get("phone") as string,
            grade: formData.get("grade") as string,
            family_condition: formData.get("family_condition") as string,
            monthly_amount: Number(formData.get("monthly_amount")) || 0,
            is_active: formData.get("is_active") === "on",
            address: formData.get("address") as string,
            school: formData.get("school") as string,
            status: formData.get("status") as string,
        };

        await createStudent(payload);
        return { success: true, message: "Học sinh đã được tạo thành công" };
    } catch (error: any) {
        console.error("[createStudentAction]", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi khi tạo học sinh." };
    }
}

/**
 * PATCH /students/:id
 * Partially update a student.
 */
export async function updateStudent(
    id: string,
    payload: UpdateStudentPayload
): Promise<ApiResponse<Student>> {
    const headers = await getAuthHeaders();
    try {
        console.log("payload update student: ", payload);
        const res = await fetch(`${BASE_URL}/students/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Failed to update student ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[updateStudent]", error);
        throw error;
    }
}

/**
 * DELETE /students/:id
 * Delete a student.
 */
export async function deleteStudent(
    id: string
): Promise<{ status: string; message: string }> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/students/${id}`, {
            method: "DELETE",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to delete student ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[deleteStudent]", error);
        throw error;
    }
}
