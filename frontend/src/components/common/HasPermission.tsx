"use client";

import React from "react";
import { usePermission } from "@/contexts/PermissionContext";

interface HasPermissionProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function HasPermission({
  permission,
  children,
  fallback = null,
}: HasPermissionProps) {
  const { hasPermission, loading } = usePermission();

  if (loading) {
    return null;
  }

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
