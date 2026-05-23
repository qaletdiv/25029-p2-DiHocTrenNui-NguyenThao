import React from "react";
import SchoolCreateClient from "../_components/SchoolCreateClient";
import { getAllTeachers } from "@/services/teachers";

export default async function SchoolCreatePage() {
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
