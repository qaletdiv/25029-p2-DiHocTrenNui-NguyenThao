import React from "react";
import { notFound } from "next/navigation";
import { getSchoolById } from "@/services/schools";
import { getAllTeachers } from "@/services/teachers";
import SchoolDetailClient from "../_components/SchoolDetailClient";

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  // Fetch teachers for coordinator selection
  const teachersResponse = await getAllTeachers();
  const teachersData = teachersResponse.data;
  const teachers =
    teachersData && "teachers" in teachersData
      ? (teachersData as any).teachers
      : Array.isArray(teachersData)
      ? teachersData
      : [];

  return <SchoolDetailClient school={school} teachers={teachers} />;
}