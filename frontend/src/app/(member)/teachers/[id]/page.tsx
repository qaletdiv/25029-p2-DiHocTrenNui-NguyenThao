import React from "react";
import { notFound } from "next/navigation";
import { getTeacherById } from "@/services/teachers";
import { getAllSchools } from "@/services/schools";
import TeacherDetailClient from "../_components/TeacherDetailClient";
import { getCurrentAccount } from "@/services/accounts";
import AccessDenied from "@/components/common/AccessDenied";

// ─────────────────────────────────────────────
// Server Component — fetches single teacher at request time
// ─────────────────────────────────────────────
export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("TEACHER_READ")) {
    return <AccessDenied title="Chi tiết Giáo viên" />;
  }

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

  let schools: any[] = [];
  if (permissions.includes("SCHOOL_READ")) {
    try {
      const schoolsResponse = await getAllSchools();
      schools = schoolsResponse.data?.schools ?? [];
    } catch (error) {
      console.error("[TeacherDetailPage] Failed to fetch schools:", error);
    }
  }

  return <TeacherDetailClient teacher={teacher} schools={schools} />;
}