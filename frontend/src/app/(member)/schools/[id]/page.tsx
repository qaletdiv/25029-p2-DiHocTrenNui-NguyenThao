import React from "react";
import { notFound } from "next/navigation";
import { getSchoolById } from "@/services/schools";
import { getAllTeachers } from "@/services/teachers";
import SchoolDetailClient from "../_components/SchoolDetailClient";
import { getCurrentAccount } from "@/services/accounts";
import AccessDenied from "@/components/common/AccessDenied";

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("SCHOOL_READ")) {
    return <AccessDenied title="Chi tiết Trường học" />;
  }

  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    notFound();
  }

  let school;
  try {
    const response = await getSchoolById(numericId);
    school = response.data;
  } catch {
    notFound();
  }

  if (!school) {
    notFound();
  }

  // Fetch teachers for coordinator selection only if permitted
  let teachers: any[] = [];
  if (permissions.includes("TEACHER_READ")) {
    try {
      const teachersResponse = await getAllTeachers();
      const teachersData = teachersResponse.data;
      teachers =
        teachersData && "teachers" in teachersData
          ? (teachersData as any).teachers
          : Array.isArray(teachersData)
          ? teachersData
          : [];
    } catch (error) {
      console.error("[SchoolDetailPage] Failed to fetch teachers:", error);
    }
  }

  return <SchoolDetailClient school={school} teachers={teachers} />;
}