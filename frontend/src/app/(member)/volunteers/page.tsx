import React from "react";
import { Users } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import { getAllVolunteers } from "@/services/volunteers";
import VolunteerListClient from "./_components/VolunteerListClient";
import { getCurrentAccount } from "@/services/accounts";
import AccessDenied from "@/components/common/AccessDenied";

// ─────────────────────────────────────────────
// Server Component — fetches data at request time
// ─────────────────────────────────────────────
export default async function VolunteersPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("VOLUNTEER_READ")) {
    return <AccessDenied title="Danh sách Tình nguyện viên" />;
  }

  const searchParams = await props.searchParams;
  const pageParam = searchParams?.page;
  const pageSizeParam = searchParams?.pageSize;

  const page = typeof pageParam === "string" ? parseInt(pageParam, 10) : 1;
  const pageSize = typeof pageSizeParam === "string" ? parseInt(pageSizeParam, 10) : 10;
  const search = typeof searchParams?.search === 'string' ? searchParams.search : '';

  const response = await getAllVolunteers(page, pageSize, search || undefined);

  const volunteers = response.data?.volunteers ?? [];
  const total = response.data?.total ?? volunteers.length;

  return (
    <PageShell
      title="Danh sách Tình nguyện viên"
      subtitle={`${total} tình nguyện viên đã đăng ký`}
      icon={Users}
      iconColor="bg-violet-100 text-violet-700"
    >
      <VolunteerListClient
        volunteers={volunteers}
        total={total}
        initialPage={page}
        initialPageSize={pageSize}
        initialSearch={search}
      />
    </PageShell>
  );
}