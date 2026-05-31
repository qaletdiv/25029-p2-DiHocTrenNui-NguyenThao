import React from "react";
import VolunteerCreateClient from "../_components/VolunteerCreateClient";
import { getAllAccounts, getCurrentAccount } from "@/services/accounts";
import { getAllVolunteers } from "@/services/volunteers";
import AccessDenied from "@/components/common/AccessDenied";

export default async function VolunteerCreatePage() {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("VOLUNTEER_CREATE")) {
    return <AccessDenied title="Tạo Tình nguyện viên" />;
  }

  // Fetch accounts and volunteers to feed the creation forms
  const accountsResponse = await getAllAccounts();
  const volunteersResponse = await getAllVolunteers();

  const accountsData = accountsResponse.data;
  const accountsList =
    accountsData && "accounts" in accountsData
      ? (accountsData as any).accounts
      : Array.isArray(accountsData)
      ? accountsData
      : [];

  // Role ID 2 represents VOLUNTEER in the backend roles list
  const volunteerAccounts = accountsList.filter(
    (acc: any) => acc.role_id === 2
  );

  const volunteersData = volunteersResponse.data;
  const volunteersList =
    volunteersData && "volunteers" in volunteersData
      ? (volunteersData as any).volunteers
      : Array.isArray(volunteersData)
      ? volunteersData
      : [];

  const linkedUsernames = new Set<string>(
    volunteersList
      .map((v: any) => v.username as string | undefined)
      .filter(Boolean) as string[]
  );

  const availableAccounts = volunteerAccounts.filter(
    (acc) => !linkedUsernames.has(acc.username)
  );

  return (
    <VolunteerCreateClient
      volunteerAccounts={volunteerAccounts}
      availableAccounts={availableAccounts}
    />
  );
}
