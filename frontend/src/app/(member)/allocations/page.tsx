import React from "react";
import { Wallet } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import { getAllDisbursements } from "@/services/disbursements";
import AllocationListClient from "./_components/AllocationListClient";

// ─────────────────────────────────────────────
// Server Component — fetches data at request time
// ─────────────────────────────────────────────
export default async function AllocationsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageParam = searchParams?.page;
  const pageSizeParam = searchParams?.pageSize;

  const page = typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1;
  const pageSize = typeof pageSizeParam === 'string' ? parseInt(pageSizeParam, 10) : 10;
  const search = typeof searchParams?.search === 'string' ? searchParams.search : '';

  const response = await getAllDisbursements(page, pageSize, search || undefined);

  // Handle both paginated and non-paginated responses gracefully
  const isPaginated = 'disbursements' in response.data;
  const disbursements = isPaginated ? (response.data as any).disbursements : response.data;
  const total = isPaginated ? (response.data as any).total : disbursements.length;
  const budgetSummary = isPaginated ? (response.data as any).budget_summary : {};

  return (
    <PageShell
      title="Danh sách Phân bổ"
      subtitle={`${total} phân bổ`}
      icon={Wallet}
      iconColor="bg-teal-900/10 text-teal-900"
    >
      <AllocationListClient
        disbursements={disbursements}
        total={total}
        initialPage={page}
        initialPageSize={pageSize}
        budgetSummary={budgetSummary}
        initialSearch={search}
      />
    </PageShell>
  );
}
