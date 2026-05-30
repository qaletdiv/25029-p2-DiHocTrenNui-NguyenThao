import React from "react";
import { notFound } from "next/navigation";
import { getStudentById } from "@/services/students";
import { getAllSchools } from "@/services/schools";
import StudentDetailClient from "../_components/StudentDetailClient";
import { getCurrentAccount } from "@/services/accounts";
import AccessDenied from "@/components/common/AccessDenied";

// ─────────────────────────────────────────────
// Server Component — fetches single student at request time
// ─────────────────────────────────────────────
export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("STUDENT_READ")) {
    return <AccessDenied title="Chi tiết Học sinh" />;
  }

  const { id } = await params;

  let student;
  let schools: any[] = [];
  try {
    const [studentResponse, schoolsResponse] = await Promise.all([
      getStudentById(id),
      getAllSchools(),
    ]);
    student = studentResponse.data;
    schools = schoolsResponse.data?.schools || [];
  } catch {
    // If getting student fails, navigate to 404
    if (!student) {
      notFound();
    }
  }

  if (!student) {
    notFound();
  }

  // Extract related data objects
  const school = student.school && typeof student.school === "object" ? student.school : null;
  const sponsor = student.sponsor && typeof student.sponsor === "object" ? student.sponsor : null;
  const teacher = student.teacher && typeof student.teacher === "object" ? student.teacher : null;
  const volunteer = student.volunteer && typeof student.volunteer === "object" ? student.volunteer : null;

  // Adapt the student object to match the expected frontend Client Component structure (school is string)
  const compatibleStudent = {
    ...student,
    school: school ? (school as any).name : (typeof student.school === "string" ? student.school : ""),
  };

  return (
    <StudentDetailClient
      student={compatibleStudent}
      schoolDetail={school as any}
      sponsorDetail={sponsor as any}
      teacherDetail={teacher as any}
      volunteerDetail={volunteer as any}
      schools={schools}
    />
  );
}