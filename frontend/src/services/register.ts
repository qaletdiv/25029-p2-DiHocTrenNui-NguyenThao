"use server";

import { redirect } from "next/navigation";

export async function registerAction(preState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const roleIdStr = formData.get("role_id") as string;

    const role_id = parseInt(roleIdStr, 10);

    // Initial check
    if (!username || !email || !password || !role_id) {
        return { ...preState, error: "Tất cả các trường là bắt buộc." };
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password, role_id })
        });

        const response = await res.json();

        if (!res.ok) {
            console.log("Registration failed:", response.message);
            return { ...preState, error: response.message || "Đăng ký không thành công." };
        }

        console.log("Registration successful");
    } catch (e: any) {
        console.error("Registration error:", e);
        return { ...preState, error: "Không thể kết nối tới máy chủ API." };
    }

    redirect("/login?registered=true");
}
