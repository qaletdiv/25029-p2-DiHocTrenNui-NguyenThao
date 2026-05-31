import React from "react";
import { getAllStudents } from "@/services/students";
import { getAllDisbursements } from "@/services/disbursements";
import { getAllTeachers } from "@/services/teachers";
import { getCurrentAccount } from "@/services/accounts";
import AccessDenied from "@/components/common/AccessDenied";
import AllocationCreateClient from "../_components/AllocationCreateClient";

// ─────────────────────────────────────────────
// Server Component — fetches lookup data for the create form
// ─────────────────────────────────────────────
export default async function NewAllocationPage() {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("DISBURSEMENT_CREATE")) {
    return <AccessDenied title="Tạo Phân bổ" />;
  }

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
  } catch (error: any) {
    if (error && error.digest === "DYNAMIC_SERVER_USAGE") {
      throw error;
    }
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


