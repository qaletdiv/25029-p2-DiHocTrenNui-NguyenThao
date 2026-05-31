import React from "react";
import { BookUser } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import { getAllTeachers } from "@/services/teachers";
import TeacherListClient from "./_components/TeacherListClient";
import { getCurrentAccount } from "@/services/accounts";
import AccessDenied from "@/components/common/AccessDenied";

// ─────────────────────────────────────────────
// Server Component — fetches data at request time
// ─────────────────────────────────────────────
export default async function TeachersPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("TEACHER_READ")) {
    return <AccessDenied title="Danh sách Giáo viên" />;
  }

  const searchParams = await props.searchParams;
  const pageParam = searchParams?.page;
  const pageSizeParam = searchParams?.pageSize;

  const page = typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1;
  const pageSize = typeof pageSizeParam === 'string' ? parseInt(pageSizeParam, 10) : 10;
  const search = typeof searchParams?.search === 'string' ? searchParams.search : '';

  const response = await getAllTeachers(page, pageSize, search || undefined);

  // Handle both paginated and non-paginated responses gracefully
  const isPaginated = 'teachers' in response.data;
  const teachers = isPaginated ? (response.data as any).teachers : response.data;
  const total = isPaginated ? (response.data as any).total : teachers.length;

  return (
    <PageShell
      title="Danh sách Giáo viên"
      subtitle={`${total} giáo viên đang hợp tác`}
      icon={BookUser}
      iconColor="bg-sky-100 text-sky-700"
    >
      <TeacherListClient
        teachers={teachers}
        total={total}
        initialPage={page}
        initialPageSize={pageSize}
        initialSearch={search}
      />
    </PageShell>
  );
}