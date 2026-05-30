import React from "react";
import TeacherCreateClient from "../_components/TeacherCreateClient";
import { getAllAccounts, getCurrentAccount } from "@/services/accounts";
import { getAllTeachers } from "@/services/teachers";
import { getAllSchools } from "@/services/schools";
import AccessDenied from "@/components/common/AccessDenied";

export default async function TeacherCreatePage() {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("TEACHER_CREATE")) {
    return <AccessDenied title="Tạo Giáo viên" />;
  }

  // Fetch accounts, teachers, and schools to feed the creation forms
  const accountsResponse = await getAllAccounts();
  const teachersResponse = await getAllTeachers();
  const schoolsResponse = await getAllSchools();

  const accountsData = accountsResponse.data;
  const accountsList =
    accountsData && "accounts" in accountsData
      ? (accountsData as any).accounts
      : Array.isArray(accountsData)
      ? accountsData
      : [];

  // Role ID 3 represents TEACHER in the backend roles list
  const teacherAccounts = accountsList.filter(
    (acc: any) => acc.role_id === 3
  );

  const teachersData = teachersResponse.data;
  const teachersList =
    teachersData && "teachers" in teachersData
      ? (teachersData as any).teachers
      : Array.isArray(teachersData)
      ? teachersData
      : [];

  const linkedUsernames = new Set<string>(
    teachersList
      .map((t: any) => t.username as string | undefined)
      .filter(Boolean) as string[]
  );

  const availableAccounts = teacherAccounts.filter(
    (acc) => !linkedUsernames.has(acc.username)
  );

  const schools = schoolsResponse.data?.schools ?? [];

  return (
    <TeacherCreateClient
      teacherAccounts={teacherAccounts}
      availableAccounts={availableAccounts}
      schools={schools}
    />
  );
}
