"use server";

import { cookies } from "next/headers";

const BASE_URL = "http://localhost:5001";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Image {
    id: number;
    student_id: number;
    url: string;
    timestamp: string;
    metadata: Record<string, unknown>;
    event_id?: string;
    [key: string]: unknown;
}

export interface CreateImagePayload {
    student_id: number;
    url: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
    event_id?: string;
}

export interface UpdateImagePayload {
    student_id?: number;
    url?: string;
    timestamp?: string;
    metadata?: Record<string, unknown>;
    event_id?: string;
}

export interface ImageRangeParams {
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
}

export interface PaginatedImages {
    images: Image[];
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

/** GET /images — Fetch all images. Supports pagination. */
export async function getAllImages(page?: number, pageSize?: number): Promise<ApiResponse<PaginatedImages | Image[]>> {
    try {
        const headers = await getAuthHeaders();
        let url = `${BASE_URL}/images`;
        if (page !== undefined && pageSize !== undefined) {
            url += `?page=${page}&pageSize=${pageSize}`;
        }
        const res = await fetch(url, { method: "GET", headers });
        if (!res.ok) throw new Error(`Failed to fetch images: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[getAllImages]", error);
        throw error;
    }
}

/** GET /images/:id — Fetch a single image by ID. */
export async function getImageById(id: number): Promise<ApiResponse<Image>> {
    try {
        const res = await fetch(`${BASE_URL}/images/${id}`, { method: "GET", headers: await getAuthHeaders() });
        if (!res.ok) throw new Error(`Failed to fetch image ${id}: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[getImageById]", error);
        throw error;
    }
}

/** GET /images/student/:studentId — Fetch all images for a specific student. */
export async function getImagesByStudent(studentId: number): Promise<ApiResponse<Image[]>> {
    try {
        const res = await fetch(`${BASE_URL}/images/student/${studentId}`, { method: "GET", headers: await getAuthHeaders() });
        if (!res.ok) throw new Error(`Failed to fetch images for student ${studentId}: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[getImagesByStudent]", error);
        throw error;
    }
}

/** GET /images/range?start=&end= — Fetch images within a date range. */
export async function getImagesByRange(params: ImageRangeParams): Promise<ApiResponse<Image[]>> {
    try {
        const query = new URLSearchParams({ start: params.start, end: params.end });
        const res = await fetch(`${BASE_URL}/images/range?${query.toString()}`, { method: "GET", headers: await getAuthHeaders() });
        if (!res.ok) throw new Error(`Failed to fetch images by range: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[getImagesByRange]", error);
        throw error;
    }
}

/** POST /images — Create a new image record. */
export async function createImage(payload: CreateImagePayload): Promise<ApiResponse<Image>> {
    try {
        const res = await fetch(`${BASE_URL}/images`, { method: "POST", headers: await getAuthHeaders(), body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(`Failed to create image: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[createImage]", error);
        throw error;
    }
}

/** PATCH /images/:id — Partially update an image record. */
export async function updateImage(id: number, payload: UpdateImagePayload): Promise<ApiResponse<Image>> {
    try {
        const res = await fetch(`${BASE_URL}/images/${id}`, { method: "PATCH", headers: await getAuthHeaders(), body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(`Failed to update image ${id}: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[updateImage]", error);
        throw error;
    }
}

/** DELETE /images/:id — Delete an image record. */
export async function deleteImage(id: number): Promise<{ status: string; message: string }> {
    try {
        const res = await fetch(`${BASE_URL}/images/${id}`, { method: "DELETE", headers: await getAuthHeaders() });
        if (!res.ok) throw new Error(`Failed to delete image ${id}: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("[deleteImage]", error);
        throw error;
    }
}
