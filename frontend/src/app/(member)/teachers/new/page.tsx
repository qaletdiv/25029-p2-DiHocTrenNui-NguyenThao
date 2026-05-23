import React from "react";
import TeacherCreateClient from "../_components/TeacherCreateClient";
import { getAllAccounts } from "@/services/accounts";
import { getAllTeachers } from "@/services/teachers";
import { getAllSchools } from "@/services/schools";

export default async function TeacherCreatePage() {
  // Fetch accounts, teachers, and schools to feed the creation forms
  const accountsResponse = await getAllAccounts();
  const teachersResponse = await getAllTeachers();
  const schoolsResponse = await getAllSchools();

  // Role ID 3 represents TEACHER in the backend roles list
  const teacherAccounts = (accountsResponse.data || []).filter(
    (acc) => acc.role_id === 3
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
