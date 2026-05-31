import React from "react";
import SponsorCreateClient from "../_components/SponsorCreateClient";
import { getAllAccounts, getCurrentAccount } from "@/services/accounts";
import { getAllSponsors } from "@/services/sponsors";
import AccessDenied from "@/components/common/AccessDenied";

export default async function SponsorCreatePage() {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("SPONSOR_CREATE")) {
    return <AccessDenied title="Tạo Nhà tài trợ" />;
  }

  // Fetch all accounts and sponsors to determine which accounts are available to be linked
  const accountsResponse = await getAllAccounts();
  const sponsorsResponse = await getAllSponsors();

  const accountsData = accountsResponse.data;
  const accountsList =
    accountsData && "accounts" in accountsData
      ? (accountsData as any).accounts
      : Array.isArray(accountsData)
      ? accountsData
      : [];

  // Sponsor role code/id: 4 represents SPONSOR in the mock database roles
  const sponsorAccounts = accountsList.filter(
    (acc: any) => acc.role_id === 4
  );

  const sponsorsData = sponsorsResponse.data;
  const sponsorsList =
    sponsorsData && "sponsors" in sponsorsData
      ? (sponsorsData as any).sponsors
      : Array.isArray(sponsorsData)
      ? sponsorsData
      : [];

  // The backend resolves account_id → username in the response, so we compare
  // by username to detect which sponsor accounts are already linked.
  const linkedUsernames = new Set<string>(
    sponsorsList
      .map((s: any) => s.username as string | undefined)
      .filter(Boolean) as string[]
  );

  // Unlinked accounts that can be associated with a new sponsor
  const availableAccounts = sponsorAccounts.filter(
    (acc) => !linkedUsernames.has(acc.username)
  );

  return (
    <SponsorCreateClient
      sponsorAccounts={sponsorAccounts}
      availableAccounts={availableAccounts}
    />
  );
}
