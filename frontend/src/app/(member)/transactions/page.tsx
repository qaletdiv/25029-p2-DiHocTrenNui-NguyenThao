import React from "react";
import { Receipt } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import { getAllTransactions } from "@/services/transactions";
import { getAllSponsors } from "@/services/sponsors";
import TransactionListClient from "./_components/TransactionListClient";
import { getCurrentAccount } from "@/services/accounts";
import AccessDenied from "@/components/common/AccessDenied";

// ─────────────────────────────────────────────
// Server Component — fetches data at request time
// ─────────────────────────────────────────────
export default async function TransactionsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("BANK_TRANSACTION_READ")) {
    return <AccessDenied title="Danh sách Giao dịch" />;
  }

  const searchParams = await props.searchParams;
  const pageParam = searchParams?.page;
  const pageSizeParam = searchParams?.pageSize;

  const page = typeof pageParam === "string" ? parseInt(pageParam, 10) : 1;
  const pageSize =
    typeof pageSizeParam === "string" ? parseInt(pageSizeParam, 10) : 10;
  const search = typeof searchParams?.search === 'string' ? searchParams.search : '';

  // Fetch transactions and sponsors in parallel
  const [txResponse, sponsorResponse] = await Promise.all([
    getAllTransactions(page, pageSize, search || undefined),
    getAllSponsors(),
  ]);

  // Handle both paginated and non-paginated responses
  const isPaginated = txResponse.data && "transactions" in txResponse.data;
  const transactions = isPaginated
    ? (txResponse.data as any).transactions
    : txResponse.data;
  const total = isPaginated
    ? (txResponse.data as any).total
    : (transactions as any[]).length;

  // Extract sponsors list
  const sponsorData = sponsorResponse.data;
  const sponsors =
    sponsorData && "sponsors" in sponsorData
      ? (sponsorData as any).sponsors
      : Array.isArray(sponsorData)
      ? sponsorData
      : [];

  return (
    <PageShell
      title="Danh sách Giao dịch"
      subtitle={`${total} giao dịch được ghi nhận`}
      icon={Receipt}
      iconColor="bg-orange-100 text-orange-700"
    >
      <TransactionListClient
        transactions={transactions}
        sponsors={sponsors}
        total={total}
        initialPage={page}
        initialPageSize={pageSize}
        initialSearch={search}
      />
    </PageShell>
  );
}