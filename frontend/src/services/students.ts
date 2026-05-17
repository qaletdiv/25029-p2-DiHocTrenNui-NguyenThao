"use server";

import { cookies } from "next/headers";

const BASE_URL = "http://localhost:5001";

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
    is_active: boolean;
    created_at: string;
    address: string;
    school: string;
    status: string;
    creator: string;
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
 * Fetch all students. Supports pagination.
 */
export async function getAllStudents(page?: number, pageSize?: number): Promise<ApiResponse<PaginatedStudents | Student[]>> {
    try {
        const headers = await getAuthHeaders();
        let url = `${BASE_URL}/students`;
        if (page !== undefined && pageSize !== undefined) {
            url += `?page=${page}&pageSize=${pageSize}`;
        }
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
    try {
        const headers = await getAuthHeaders();
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
    try {
        const headers = await getAuthHeaders();
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

/**
 * PATCH /students/:id
 * Partially update a student.
 */
export async function updateStudent(
    id: string,
    payload: UpdateStudentPayload
): Promise<ApiResponse<Student>> {
    try {
        const headers = await getAuthHeaders();
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
    try {
        const headers = await getAuthHeaders();
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
