import React from "react";
import { getAllSchools } from "@/services/schools";
import StudentCreateClient from "../_components/StudentCreateClient";
import { getCurrentAccount } from "@/services/accounts";
import AccessDenied from "@/components/common/AccessDenied";

export default async function StudentCreatePage() {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("STUDENT_CREATE")) {
    return <AccessDenied title="Tạo Học sinh" />;
  }

  let schools: any[] = [];
  try {
    const response = await getAllSchools();
    schools = response.data?.schools || [];
  } catch (error) {
    console.error("Failed to fetch schools for student creation:", error);
  }

  return <StudentCreateClient schools={schools} />;
}
