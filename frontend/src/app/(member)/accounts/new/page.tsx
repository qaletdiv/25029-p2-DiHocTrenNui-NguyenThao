import React from "react";
import AccountCreateClient from "../_components/AccountCreateClient";
import { getCurrentAccount } from "@/services/accounts";
import AccessDenied from "@/components/common/AccessDenied";

export default async function AccountCreatePage() {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("USER_CREATE")) {
    return <AccessDenied title="Tạo Tài khoản" />;
  }

  return <AccountCreateClient />;
}
