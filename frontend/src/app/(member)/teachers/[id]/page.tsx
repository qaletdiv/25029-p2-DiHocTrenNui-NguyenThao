import React from "react";
import { notFound } from "next/navigation";
import { getTeacherById } from "@/services/teachers";
import { getAllSchools } from "@/services/schools";
import TeacherDetailClient from "../_components/TeacherDetailClient";

// ─────────────────────────────────────────────
// Server Component — fetches single teacher at request time
// ─────────────────────────────────────────────
export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    notFound();
  }

  let teacher;
  try {
    const response = await getTeacherById(numericId);
    teacher = response.data;
  } catch {
    notFound();
  }

  if (!teacher) {
    notFound();
  }

  const schoolsResponse = await getAllSchools();
  const schools = schoolsResponse.data?.schools ?? [];



  return <TeacherDetailClient teacher={teacher} schools={schools} />;
}