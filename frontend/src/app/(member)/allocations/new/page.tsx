import React from "react";
import { getAllStudents } from "@/services/students";
import { getAllDisbursements } from "@/services/disbursements";
import { getAllTeachers } from "@/services/teachers";
import AllocationCreateClient from "../_components/AllocationCreateClient";

// ─────────────────────────────────────────────
// Server Component — fetches lookup data for the create form
// ─────────────────────────────────────────────
export default async function NewAllocationPage() {
  let students: any[] = [];
  let teachers: any[] = [];
  let budgetSummary: any = {};

  try {
    const [studentsResponse, disbursementsResponse, teachersResponse] = await Promise.all([
      getAllStudents(),
      getAllDisbursements(),
      getAllTeachers(),
    ]);

    const studentsData = studentsResponse.data;
    students = 'students' in studentsData ? (studentsData as any).students : studentsData;

    const disbData = disbursementsResponse.data;
    budgetSummary = 'budget_summary' in disbData ? (disbData as any).budget_summary : {};

    const teachersData = teachersResponse.data;
    teachers = 'teachers' in teachersData ? (teachersData as any).teachers : teachersData;
  } catch (error) {
    console.error("[NewAllocationPage] Error fetching data:", error);
  }

  return (
    <AllocationCreateClient
      students={students}
      teachers={teachers}
      budgetSummary={budgetSummary}
    />
  );
}

