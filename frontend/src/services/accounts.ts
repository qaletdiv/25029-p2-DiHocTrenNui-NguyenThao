"use server";

import { cookies } from "next/headers";

const BASE_URL = "http://localhost:5001";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Account {
    id: number;
    username: string;
    email: string;
    role_id: number;
    is_active: boolean;
    permissions?: string[];
    [key: string]: unknown;
}

export interface CreateAccountPayload {
    username: string;
    email: string;
    password: string;
    role_id: number;
}

export interface UpdateAccountPayload {
    username?: string;
    email?: string;
    password?: string;
    role_id?: number;
    is_active?: boolean;
}

export interface ApiResponse<T> {
    status: string;
    data: T;
}

export interface PaginatedAccounts {
    accounts: Account[];
    total: number;
    page: number;
    pageSize: number;
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
 * GET /accounts
 * Fetch all accounts.
 */
export async function getAllAccounts(page?: number, pageSize?: number): Promise<ApiResponse<PaginatedAccounts | Account[]>> {
    try {
        const headers = await getAuthHeaders();
        let url = `${BASE_URL}/accounts`;
        if (page !== undefined && pageSize !== undefined) {
            url += `?page=${page}&pageSize=${pageSize}`;
        }
        const res = await fetch(url, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch accounts: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[getAllAccounts]", error);
        throw error;
    }
}

/**
 * GET /accounts/:id
 * Fetch a single account by ID.
 */
export async function getAccountById(id: number): Promise<ApiResponse<Account>> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/accounts/${id}`, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch account ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[getAccountById]", error);
        throw error;
    }
}

/**
 * POST /accounts
 * Create a new account.
 */
export async function createAccount(
    payload: CreateAccountPayload
): Promise<ApiResponse<Account>> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/accounts`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Failed to create account: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[createAccount]", error);
        throw error;
    }
}

/**
 * PATCH /accounts/:id
 * Partially update an account.
 */
export async function updateAccount(
    id: number,
    payload: UpdateAccountPayload
): Promise<ApiResponse<Account>> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/accounts/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Failed to update account ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[updateAccount]", error);
        throw error;
    }
}

/**
 * DELETE /accounts/:id
 * Delete an account.
 */
export async function deleteAccount(
    id: number
): Promise<{ status: string; message: string }> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/accounts/${id}`, {
            method: "DELETE",
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to delete account ${id}: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("[deleteAccount]", error);
        throw error;
    }
}

/**
 * Decode access token cookie and fetch current signed-in account details.
 */
export async function getCurrentAccount(): Promise<Account | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;
        if (!token) return null;

        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        
        // Decode base64 payload of JWT
        const payloadStr = parts[1];
        const payload = JSON.parse(Buffer.from(payloadStr, 'base64').toString('utf-8'));
        
        if (!payload || !payload.id) {
            return null;
        }

        const res = await getAccountById(payload.id);
        return res.data;
    } catch (error) {
        console.error("[getCurrentAccount] Error", error);
        return null;
    }
}

export interface FormState {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
}

export async function createAccountAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        const payload: CreateAccountPayload = {
            username: formData.get("username") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            role_id: Number(formData.get("role_id")),
        };

        await createAccount(payload);
        return { success: true, message: "Tài khoản đã được tạo thành công" };
    } catch (error: any) {
        console.error("[createAccountAction]", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi khi tạo tài khoản." };
    }
}


