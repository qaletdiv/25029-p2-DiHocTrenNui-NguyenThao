import React from "react";
import { getAllSchools } from "@/services/schools";
import StudentCreateClient from "../_components/StudentCreateClient";

export default async function StudentCreatePage() {
  let schools: any[] = [];
  try {
    const response = await getAllSchools();
    schools = response.data?.schools || [];
  } catch (error) {
    console.error("Failed to fetch schools for student creation:", error);
  }

  return <StudentCreateClient schools={schools} />;
}
