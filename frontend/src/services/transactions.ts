"use server";

import { cookies } from "next/headers";

const BASE_URL = "http://localhost:5001";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Transaction {
    id: number;
    transfer_date: string;
    amount: number;
    transfer_content: string;
    status_id: number;
    [key: string]: unknown;
}

export interface CreateTransactionPayload {
    transfer_date: string;
    amount: number;
    transfer_content: string;
    status_id: number;
}

export interface UpdateTransactionPayload {
    transfer_date?: string;
    amount?: number;
    transfer_content?: string;
    status_id?: number;
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

/** GET /bank-transactions — Fetch all bank transactions. */
export async function getAllTransactions(): Promise<ApiResponse<Transaction[]>> {
    try {
        const res = await fetch(`${BASE_URL}/bank-transactions`, { method: "GET", headers: await getAuthHeaders() });
        if (!res.ok) throw new Error(`Failed to fetch transactions: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[getAllTransactions]", error);
        throw error;
    }
}

/** GET /bank-transactions/:id — Fetch a single transaction by ID. */
export async function getTransactionById(id: number): Promise<ApiResponse<Transaction>> {
    try {
        const res = await fetch(`${BASE_URL}/bank-transactions/${id}`, { method: "GET", headers: await getAuthHeaders() });
        if (!res.ok) throw new Error(`Failed to fetch transaction ${id}: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[getTransactionById]", error);
        throw error;
    }
}

/** POST /bank-transactions — Create a new bank transaction. */
export async function createTransaction(payload: CreateTransactionPayload): Promise<ApiResponse<Transaction>> {
    try {
        const res = await fetch(`${BASE_URL}/bank-transactions`, { method: "POST", headers: await getAuthHeaders(), body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(`Failed to create transaction: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[createTransaction]", error);
        throw error;
    }
}

/** PATCH /bank-transactions/:id — Partially update a transaction. */
export async function updateTransaction(id: number, payload: UpdateTransactionPayload): Promise<ApiResponse<Transaction>> {
    try {
        const res = await fetch(`${BASE_URL}/bank-transactions/${id}`, { method: "PATCH", headers: await getAuthHeaders(), body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(`Failed to update transaction ${id}: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[updateTransaction]", error);
        throw error;
    }
}

/** DELETE /bank-transactions/:id — Delete a transaction. */
export async function deleteTransaction(id: number): Promise<{ status: string; message: string }> {
    try {
        const res = await fetch(`${BASE_URL}/bank-transactions/${id}`, { method: "DELETE", headers: await getAuthHeaders() });
        if (!res.ok) throw new Error(`Failed to delete transaction ${id}: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[deleteTransaction]", error);
        throw error;
    }
}
