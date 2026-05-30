import React from "react";
import { notFound } from "next/navigation";
import { getTransactionById } from "@/services/transactions";
import { getAllSponsors } from "@/services/sponsors";
import TransactionDetailClient from "../_components/TransactionDetailClient";
import { getCurrentAccount } from "@/services/accounts";
import AccessDenied from "@/components/common/AccessDenied";

// ─────────────────────────────────────────────
// Server Component — fetches single transaction at request time
// ─────────────────────────────────────────────
export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("BANK_TRANSACTION_READ")) {
    return <AccessDenied title="Chi tiết Giao dịch" />;
  }

  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    notFound();
  }

  let transaction;
  try {
    const response = await getTransactionById(numericId);
    transaction = response.data;
  } catch (error) {
    notFound();
  }

  if (!transaction) {
    notFound();
  }

  // Fetch sponsors for sponsor selection dropdown
  let sponsors: any[] = [];
  try {
    const sponsorsResponse = await getAllSponsors();
    const sponsorData = sponsorsResponse.data;
    sponsors =
      sponsorData && "sponsors" in sponsorData
        ? (sponsorData as any).sponsors
        : Array.isArray(sponsorData)
        ? sponsorData
        : [];
  } catch (error) {
    console.error("Failed to fetch sponsors in transaction detail:", error);
  }

  return (
    <TransactionDetailClient transaction={transaction} sponsors={sponsors} />
  );
}
