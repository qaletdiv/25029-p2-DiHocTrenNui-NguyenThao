import React from "react";
import { notFound } from "next/navigation";
import { getVolunteerById } from "@/services/volunteers";
import VolunteerDetailClient from "../_components/VolunteerDetailClient";

// ─────────────────────────────────────────────
// Server Component — fetches single volunteer at request time
// ─────────────────────────────────────────────
export default async function VolunteerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    notFound();
  }

  let volunteer;
  try {
    const response = await getVolunteerById(numericId);
    volunteer = response.data;
  } catch {
    notFound();
  }

  if (!volunteer) {
    notFound();
  }

  return <VolunteerDetailClient volunteer={volunteer} />;
}