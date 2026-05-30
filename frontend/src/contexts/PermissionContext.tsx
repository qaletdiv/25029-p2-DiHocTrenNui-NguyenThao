"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentAccount, type Account } from "@/services/accounts";

interface PermissionContextType {
  account: Account | null;
  permissions: string[];
  loading: boolean;
  hasPermission: (permissionCode: string) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentAccount();
        setAccount(data);
      } catch (err) {
        console.error("Failed to load user permissions", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const permissions = (account?.permissions as string[]) || [];

  const hasPermission = (permissionCode: string) => {
    return permissions.includes(permissionCode);
  };

  return (
    <PermissionContext.Provider value={{ account, permissions, loading, hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error("usePermission must be used within a PermissionProvider");
  }
  return context;
};
