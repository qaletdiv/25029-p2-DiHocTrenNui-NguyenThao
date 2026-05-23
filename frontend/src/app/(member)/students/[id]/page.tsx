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
    />
  );
}