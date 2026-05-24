import React from "react";
import { notFound } from "next/navigation";
import { getAccountById } from "@/services/accounts";
import AccountDetailClient from "../_components/AccountDetailClient";

// ─────────────────────────────────────────────
// Server Component — fetches single account at request time
// ─────────────────────────────────────────────
export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let account;
  try {
    const accountId = parseInt(id, 10);
    if (isNaN(accountId)) {
      notFound();
    }
    const response = await getAccountById(accountId);
    account = response.data;
  } catch (error) {
    console.error(`Failed to fetch account with id ${id}:`, error);
  }

  if (!account) {
    notFound();
  }

  return (
    <AccountDetailClient
      account={account}
    />
  );
}