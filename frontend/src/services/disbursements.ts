"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Disbursement {
    id: number;
    bank_transaction_id: number;
    sponsor_student_id: number;
    student_id: string;
    teacher_id: number;
    support_month: number;
    support_year: number;
    amount: number;
    delivered_at: string | null;
    created_at: string;
    // Resolved fields from backend formatting
    student_name: string;
    teacher_name: string;
    status: string;
    status_name: string;
    transaction_code: string;
    sponsor_name: string;
    sponsor_id: number;
    // Detail-only fields
    student?: Record<string, unknown>;
    sponsor?: Record<string, unknown>;
    teacher?: Record<string, unknown>;
    transaction?: Record<string, unknown>;
    budget?: BudgetInfo;
    [key: string]: unknown;
}

export interface BudgetInfo {
    transaction_code: string;
    total_amount: number;
    allocated: number;
    remaining: number;
}

export interface BudgetSummary {
    [txId: string]: BudgetInfo;
}

export interface CreateDisbursementPayload {
    bank_transaction_id: number;
    sponsor_student_id?: number;
    student_id: string;
    teacher_id?: number;
    support_month: number;
    support_year: number;
    amount: number;
    delivered_at?: string;
    status?: string;
}

export interface UpdateDisbursementPayload {
    bank_transaction_id?: number;
    sponsor_student_id?: number;
    student_id?: string;
    teacher_id?: number;
    support_month?: number;
    support_year?: number;
    amount?: number;
    delivered_at?: string;
    status?: string;
}

export interface ApiResponse<T> {
    status: string;
    success: boolean;
    data: T;
}

export interface PaginatedDisbursements {
    disbursements: Disbursement[];
    total: number;
    page: number;
    pageSize: number;
    budget_summary: BudgetSummary;
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
 * GET /disbursements
 * Fetch all disbursements. Supports pagination.
 */
export async function getAllDisbursements(page?: number, pageSize?: number): Promise<ApiResponse<PaginatedDisbursements | Disbursement[]>> {
    const headers = await getAuthHeaders();
    try {
        let url = `${BASE_URL}/disbursements`;
        if (page !== undefined && pageSize !== undefined) {
            url += `?page=${page}&pageSize=${pageSize}`;
        }
        const res = await fetch(url, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch disbursements: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[getAllDisbursements]", error);
        throw error;
    }
}

/**
 * GET /disbursements/:id
 * Fetch a single disbursement by ID with full related data.
 */
export async function getDisbursementById(id: number): Promise<ApiResponse<Disbursement>> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/disbursements/${id}`, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch disbursement ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[getDisbursementById]", error);
        throw error;
    }
}

/**
 * POST /disbursements
 * Create a new disbursement.
 */
export async function createDisbursement(
    payload: CreateDisbursementPayload
): Promise<ApiResponse<Disbursement>> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/disbursements`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({}));
            throw new Error(errorBody.message || `Failed to create disbursement: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[createDisbursement]", error);
        throw error;
    }
}

export interface FormState {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
}

export async function createDisbursementAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        const payload: CreateDisbursementPayload = {
            bank_transaction_id: Number(formData.get("bank_transaction_id")),
            sponsor_student_id: Number(formData.get("sponsor_student_id")) || undefined,
            student_id: formData.get("student_id") as string,
            teacher_id: Number(formData.get("teacher_id")) || undefined,
            support_month: Number(formData.get("support_month")),
            support_year: Number(formData.get("support_year")),
            amount: Number(formData.get("amount")),
            delivered_at: (formData.get("delivered_at") as string) || undefined,
            status: (formData.get("status") as string) || undefined,
        };

        await createDisbursement(payload);
        return { success: true, message: "Phân bổ đã được tạo thành công" };
    } catch (error: any) {
        console.error("[createDisbursementAction]", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi khi tạo phân bổ." };
    }
}

/**
 * PATCH /disbursements/:id
 * Partially update a disbursement.
 */
export async function updateDisbursement(
    id: number,
    payload: UpdateDisbursementPayload
): Promise<ApiResponse<Disbursement>> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/disbursements/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({}));
            throw new Error(errorBody.message || `Failed to update disbursement ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[updateDisbursement]", error);
        throw error;
    }
}

/**
 * DELETE /disbursements/:id
 * Delete a disbursement.
 */
export async function deleteDisbursement(
    id: number
): Promise<{ status: string; message: string }> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/disbursements/${id}`, {
            method: "DELETE",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to delete disbursement ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[deleteDisbursement]", error);
        throw error;
    }
}
