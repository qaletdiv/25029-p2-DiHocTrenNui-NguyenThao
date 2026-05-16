"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(preState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
        console.log("Login failed: Email hoặc mật khẩu không đúng");
        return { ...preState, error: "Email hoặc mật khẩu không đúng" };
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