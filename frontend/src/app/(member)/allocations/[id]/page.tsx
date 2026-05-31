import React from "react";
import { notFound } from "next/navigation";
import { getDisbursementById, getAllDisbursements } from "@/services/disbursements";
import { getAllStudents } from "@/services/students";
import { getAllTeachers } from "@/services/teachers";
import { getAllTransactions } from "@/services/transactions";
import { getCurrentAccount } from "@/services/accounts";
import AllocationDetailClient from "../_components/AllocationDetailClient";

// ─────────────────────────────────────────────
// Server Component — fetches single disbursement at request time
// ─────────────────────────────────────────────
export default async function AllocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  const hasTxRead = permissions.includes("BANK_TRANSACTION_READ");

  let disbursement;
  let students: any[] = [];
  let teachers: any[] = [];
  let transactions: any[] = [];
  let budgetSummary: any = {};

  try {
    const [
      disbursementResponse,
      studentsResponse,
      teachersResponse,
      transactionsResponse,
      allDisbursementsResponse,
    ] = await Promise.all([
      getDisbursementById(parseInt(id)),
      getAllStudents(),
      getAllTeachers(),
      hasTxRead ? getAllTransactions() : Promise.resolve({ data: [] }),
      getAllDisbursements(),
    ]);
    disbursement = disbursementResponse.data;

    // Extract students list
    const studentsData = studentsResponse.data;
    students = 'students' in studentsData ? (studentsData as any).students : studentsData;

    // Extract teachers list
    const teachersData = teachersResponse.data;
    teachers = 'teachers' in teachersData ? (teachersData as any).teachers : teachersData;

    // Extract transactions list
    const transactionsData = transactionsResponse.data;
    transactions = 'transactions' in transactionsData ? (transactionsData as any).transactions : transactionsData;

    // Extract budget summary
    const disbData = allDisbursementsResponse.data;
    budgetSummary = 'budget_summary' in disbData ? (disbData as any).budget_summary : {};
  } catch (error) {
    console.error("[AllocationDetailPage] Error fetching detail data:", error);
    if (!disbursement) {
      notFound();
    }
  }

  if (!disbursement) {
    notFound();
  }

  return (
    <AllocationDetailClient
      disbursement={disbursement}
      students={students}
      teachers={teachers}
      transactions={transactions}
      budgetSummary={budgetSummary}
    />
  );
}



