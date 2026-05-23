import React from "react";
import VolunteerCreateClient from "../_components/VolunteerCreateClient";
import { getAllAccounts } from "@/services/accounts";
import { getAllVolunteers } from "@/services/volunteers";

export default async function VolunteerCreatePage() {
  // Fetch accounts and volunteers to feed the creation forms
  const accountsResponse = await getAllAccounts();
  const volunteersResponse = await getAllVolunteers();

  // Role ID 2 represents VOLUNTEER in the backend roles list
  const volunteerAccounts = (accountsResponse.data || []).filter(
    (acc) => acc.role_id === 2
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
