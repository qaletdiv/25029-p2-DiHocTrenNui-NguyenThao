import React from "react";
import { redirect } from "next/navigation";

interface HomeProps {}

export default function Home({}: HomeProps) {
    redirect("/home");
}
