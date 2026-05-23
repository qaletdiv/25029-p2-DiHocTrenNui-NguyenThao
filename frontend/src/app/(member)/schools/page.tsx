import React from "react";
import { School as SchoolIcon } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import { getAllSchools } from "@/services/schools";
import { getAllTeachers } from "@/services/teachers";
import SchoolListClient from "./_components/SchoolListClient";

// ─────────────────────────────────────────────
// Server Component — fetches data at request time
// ─────────────────────────────────────────────
export default async function SchoolsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageParam = searchParams?.page;
  const pageSizeParam = searchParams?.pageSize;

  const page = typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1;
  const pageSize = typeof pageSizeParam === 'string' ? parseInt(pageSizeParam, 10) : 10;

  const response = await getAllSchools(page, pageSize);

  // Handle both paginated and non-paginated responses gracefully
  const isPaginated = response.data && 'schools' in response.data;
  const schools = isPaginated ? (response.data as any).schools : (response.data || []);
  const total = isPaginated ? (response.data as any).total : schools.length;

  // Fetch teachers to map teacher_id to teacher names
  const teachersResponse = await getAllTeachers();
  const teachersData = teachersResponse.data;
  const teachersList =
    teachersData && "teachers" in teachersData
      ? (teachersData as any).teachers
      : Array.isArray(teachersData)
      ? teachersData
      : [];

  return (
    <PageShell
      title="Danh sách Trường học"
      subtitle={`${total} trường học`}
      icon={SchoolIcon}
      iconColor="bg-emerald-900/10 text-emerald-900"
    >
      <SchoolListClient
        schools={schools}
        total={total}
        initialPage={page}
        initialPageSize={pageSize}
        teachers={teachersList}
      />
    </PageShell>
  );
}