import React from "react";
import { ShieldCheck } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import { getAllAccounts } from "@/services/accounts";
import AccountListClient from "./_components/AccountListClient";

// ─────────────────────────────────────────────
// Server Component — fetches data at request time
// ─────────────────────────────────────────────
export default async function AccountsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageParam = searchParams?.page;
  const pageSizeParam = searchParams?.pageSize;

  const page = typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1;
  const pageSize = typeof pageSizeParam === 'string' ? parseInt(pageSizeParam, 10) : 10;

  const response = await getAllAccounts(page, pageSize);

  // Handle both paginated and non-paginated responses gracefully
  const isPaginated = 'accounts' in response.data;
  const accounts = isPaginated ? (response.data as any).accounts : response.data;
  const total = isPaginated ? (response.data as any).total : (Array.isArray(accounts) ? accounts.length : 0);

  return (
    <PageShell
      title="Quản lý Tài khoản"
      subtitle={`${total} tài khoản trong hệ thống`}
      icon={ShieldCheck}
      iconColor="bg-violet-100 text-violet-700"
    >
      <AccountListClient accounts={accounts} total={total} initialPage={page} initialPageSize={pageSize} />
    </PageShell>
  );
}