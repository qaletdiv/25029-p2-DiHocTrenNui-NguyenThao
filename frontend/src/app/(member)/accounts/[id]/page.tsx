import React from "react";
import { notFound } from "next/navigation";
import { getAccountById, getCurrentAccount } from "@/services/accounts";
import AccountDetailClient from "../_components/AccountDetailClient";
import AccessDenied from "@/components/common/AccessDenied";

// ─────────────────────────────────────────────
// Server Component — fetches single account at request time
// ─────────────────────────────────────────────
export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accountId = parseInt(id, 10);
  if (isNaN(accountId)) {
    notFound();
  }

  const currentAcc = await getCurrentAccount();
  const permissions = currentAcc?.permissions || [];
  
  const isSelf = currentAcc && currentAcc.id === accountId;
  const hasGlobalRead = permissions.includes("USER_READ");

  if (!isSelf && !hasGlobalRead) {
    return <AccessDenied title="Chi tiết Tài khoản" />;
  }

  let account;
  try {
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