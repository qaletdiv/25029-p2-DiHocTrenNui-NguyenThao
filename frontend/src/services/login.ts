"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(preState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
        console.log("Login failed: Username hoặc mật khẩu không đúng");
        return { ...preState, error: "Username hoặc mật khẩu không đúng" };
    }

    //Xac thuc thanh cong, luu token vao cookie
    const response = await res.json();
    const { accessToken } = response.data;
    const cookieStore = await cookies();
    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24, // 1 ngay
        path: "/"
    });
    console.log("Login successful: Token saved to cookie");
    redirect("/dashboard");
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    redirect("/login");
}