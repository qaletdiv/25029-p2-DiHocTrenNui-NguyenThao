import React from "react";
import SchoolCreateClient from "../_components/SchoolCreateClient";
import { getAllTeachers } from "@/services/teachers";
import { getCurrentAccount } from "@/services/accounts";
import AccessDenied from "@/components/common/AccessDenied";

export default async function SchoolCreatePage() {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("SCHOOL_CREATE")) {
    return <AccessDenied title="Tạo Trường học" />;
  }

  const teachersResponse = await getAllTeachers();

  const teachersData = teachersResponse.data;
  const teachersList =
    teachersData && "teachers" in teachersData
      ? (teachersData as any).teachers
      : Array.isArray(teachersData)
      ? teachersData
      : [];

  return <SchoolCreateClient teachers={teachersList} />;
}
