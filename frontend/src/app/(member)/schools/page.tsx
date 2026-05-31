import React from "react";
import { School as SchoolIcon } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import { getAllSchools } from "@/services/schools";
import { getAllTeachers } from "@/services/teachers";
import SchoolListClient from "./_components/SchoolListClient";
import { getCurrentAccount } from "@/services/accounts";
import AccessDenied from "@/components/common/AccessDenied";

// ─────────────────────────────────────────────
// Server Component — fetches data at request time
// ─────────────────────────────────────────────
export default async function SchoolsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("SCHOOL_READ")) {
    return <AccessDenied title="Danh sách Trường học" />;
  }

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

  // Fetch teachers to map teacher_id to teacher names only if permitted
  let teachersList: any[] = [];
  if (permissions.includes("TEACHER_READ")) {
    try {
      const teachersResponse = await getAllTeachers();
      const teachersData = teachersResponse.data;
      teachersList =
        teachersData && "teachers" in teachersData
          ? (teachersData as any).teachers
          : Array.isArray(teachersData)
          ? teachersData
          : [];
    } catch (error) {
      console.error("[SchoolsPage] Failed to fetch teachers:", error);
    }
  }

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