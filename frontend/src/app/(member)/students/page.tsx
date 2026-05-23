import React from "react";
import { GraduationCap } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import { getAllStudents } from "@/services/students";
import StudentListClient from "./_components/StudentListClient";

// ─────────────────────────────────────────────
// Server Component — fetches data at request time
// ─────────────────────────────────────────────
export default async function StudentsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageParam = searchParams?.page;
  const pageSizeParam = searchParams?.pageSize;

  const page = typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1;
  const pageSize = typeof pageSizeParam === 'string' ? parseInt(pageSizeParam, 10) : 10;

  const response = await getAllStudents(page, pageSize);

  // Handle both paginated and non-paginated responses gracefully
  const isPaginated = 'students' in response.data;
  const students = isPaginated ? (response.data as any).students : response.data;
  const total = isPaginated ? (response.data as any).total : students.length;

  return (
    <PageShell
      title="Danh sách Học sinh"
      subtitle={`${total} học sinh`}
      icon={GraduationCap}
      iconColor="bg-primary-900/10 text-primary-900"
    >
      <StudentListClient students={students} total={total} initialPage={page} initialPageSize={pageSize} />
    </PageShell>
  );
}