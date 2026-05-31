"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Transaction {
    id: number;
    sponsor_id?: number;
    transaction_code?: string;
    bank_name?: string;
    account_number?: string;
    transfer_date: string;
    amount: number;
    transfer_content: string;
    status_id: number;
    verified_by?: number;
    verified_at?: string;
    created_at?: string;
    [key: string]: unknown;
}

export interface CreateTransactionPayload {
    transfer_date: string;
    amount: number;
    transfer_content: string;
    status_id: number;
    sponsor_id?: number;
    bank_name?: string;
    account_number?: string;
    transaction_code?: string;
}

export interface UpdateTransactionPayload {
    transfer_date?: string;
    amount?: number;
    transfer_content?: string;
    status_id?: number;
    sponsor_id?: number;
    bank_name?: string;
    account_number?: string;
    transaction_code?: string;
}

export interface ApiResponse<T> {
    status: string;
    data: T;
}

export interface PaginatedTransactions {
    transactions: Transaction[];
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

/** GET /bank-transactions — Fetch all bank transactions. Supports pagination. */
export async function getAllTransactions(page?: number, pageSize?: number): Promise<ApiResponse<PaginatedTransactions | Transaction[]>> {
    const headers = await getAuthHeaders();
    try {
        let url = `${BASE_URL}/bank-transactions`;
        if (page !== undefined && pageSize !== undefined) {
            url += `?page=${page}&pageSize=${pageSize}`;
        }
        const res = await fetch(url, { method: "GET", headers });
        if (!res.ok) throw new Error(`Failed to fetch transactions: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[getAllTransactions]", error);
        throw error;
    }
}

/** GET /bank-transactions/:id — Fetch a single transaction by ID. */
export async function getTransactionById(id: number): Promise<ApiResponse<Transaction>> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/bank-transactions/${id}`, { method: "GET", headers });
        if (!res.ok) throw new Error(`Failed to fetch transaction ${id}: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[getTransactionById]", error);
        throw error;
    }
}

/** POST /bank-transactions — Create a new bank transaction. */
export async function createTransaction(payload: CreateTransactionPayload): Promise<ApiResponse<Transaction>> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/bank-transactions`, { method: "POST", headers, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(`Failed to create transaction: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[createTransaction]", error);
        throw error;
    }
}

/** PATCH /bank-transactions/:id — Partially update a transaction. */
export async function updateTransaction(id: number, payload: UpdateTransactionPayload): Promise<ApiResponse<Transaction>> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/bank-transactions/${id}`, { method: "PATCH", headers, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(`Failed to update transaction ${id}: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[updateTransaction]", error);
        throw error;
    }
}

/** DELETE /bank-transactions/:id — Delete a transaction. */
export async function deleteTransaction(id: number): Promise<{ status: string; message: string }> {
    const headers = await getAuthHeaders();
    try {
        const res = await fetch(`${BASE_URL}/bank-transactions/${id}`, { method: "DELETE", headers });
        if (!res.ok) throw new Error(`Failed to delete transaction ${id}: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[deleteTransaction]", error);
        throw error;
    }
}

// ─── Server Actions ──────────────────────────────────────────────────────────

export interface FormState {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
}

export async function createTransactionAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        const payload: CreateTransactionPayload = {
            transfer_date: formData.get("transfer_date") as string,
            amount: Number(formData.get("amount")),
            transfer_content: formData.get("transfer_content") as string,
            status_id: Number(formData.get("status_id")),
        };

        const sponsorId = formData.get("sponsor_id");
        if (sponsorId && String(sponsorId) !== "") payload.sponsor_id = Number(sponsorId);
        const bankName = formData.get("bank_name") as string;
        if (bankName) payload.bank_name = bankName;
        const accountNumber = formData.get("account_number") as string;
        if (accountNumber) payload.account_number = accountNumber;
        const transactionCode = formData.get("transaction_code") as string;
        if (transactionCode) payload.transaction_code = transactionCode;

        await createTransaction(payload);
        return { success: true, message: "Giao dịch đã được tạo thành công" };
    } catch (error: any) {
        console.error("[createTransactionAction]", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi khi tạo giao dịch." };
    }
}

export async function updateTransactionAction(
    id: number,
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        const payload: UpdateTransactionPayload = {};

        const transferDate = formData.get("transfer_date") as string;
        if (transferDate) payload.transfer_date = transferDate;
        const amount = formData.get("amount");
        if (amount && String(amount) !== "") payload.amount = Number(amount);
        const transferContent = formData.get("transfer_content") as string;
        if (transferContent) payload.transfer_content = transferContent;
        const statusId = formData.get("status_id");
        if (statusId && String(statusId) !== "") payload.status_id = Number(statusId);
        const sponsorId = formData.get("sponsor_id");
        if (sponsorId && String(sponsorId) !== "") payload.sponsor_id = Number(sponsorId);
        const bankName = formData.get("bank_name") as string;
        if (bankName) payload.bank_name = bankName;
        const accountNumber = formData.get("account_number") as string;
        if (accountNumber) payload.account_number = accountNumber;
        const transactionCode = formData.get("transaction_code") as string;
        if (transactionCode) payload.transaction_code = transactionCode;

        await updateTransaction(id, payload);
        return { success: true, message: "Giao dịch đã được cập nhật thành công" };
    } catch (error: any) {
        console.error("[updateTransactionAction]", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi khi cập nhật giao dịch." };
    }
}

export async function deleteTransactionAction(id: number): Promise<FormState> {
    try {
        await deleteTransaction(id);
        return { success: true, message: "Giao dịch đã được xóa thành công" };
    } catch (error: any) {
        console.error("[deleteTransactionAction]", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi khi xóa giao dịch." };
    }
}
