import React from "react";
import { HandHeart } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import { getAllSponsors } from "@/services/sponsors";
import SponsorListClient from "./_components/SponsorListClient";
import { getCurrentAccount } from "@/services/accounts";
import AccessDenied from "@/components/common/AccessDenied";

// ─────────────────────────────────────────────
// Server Component — fetches data at request time
// ─────────────────────────────────────────────
export default async function SponsorsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("SPONSOR_READ")) {
    return <AccessDenied title="Danh sách Nhà tài trợ" />;
  }

  const searchParams = await props.searchParams;
  const pageParam = searchParams?.page;
  const pageSizeParam = searchParams?.pageSize;

  const page = typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1;
  const pageSize = typeof pageSizeParam === 'string' ? parseInt(pageSizeParam, 10) : 10;

  const response = await getAllSponsors(page, pageSize);

  // Handle both paginated and non-paginated responses gracefully
  const isPaginated = 'sponsors' in response.data;
  const sponsors = isPaginated ? (response.data as any).sponsors : response.data;
  const total = isPaginated ? (response.data as any).total : sponsors.length;

  return (
    <PageShell
      title="Danh sách Nhà tài trợ"
      subtitle={`${total} nhà tài trợ đang đồng hành`}
      icon={HandHeart}
      iconColor="bg-accent-yellow/20 text-yellow-700"
    >
      <SponsorListClient sponsors={sponsors} total={total} initialPage={page} initialPageSize={pageSize} />
    </PageShell>
  );
}