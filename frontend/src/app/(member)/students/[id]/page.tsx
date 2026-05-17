import React from "react";
import { notFound } from "next/navigation";
import { getStudentById } from "@/services/students";
import StudentDetailClient from "../_components/StudentDetailClient";

// ─────────────────────────────────────────────
// Server Component — fetches single student at request time
// ─────────────────────────────────────────────
export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let student;
  try {
    const response = await getStudentById(id);
    student = response.data;
  } catch {
    // getStudentById throws on non-2xx (e.g. 404 from the backend)
    notFound();
  }

  if (!student) {
    notFound();
  }

  return <StudentDetailClient student={student} />;
}