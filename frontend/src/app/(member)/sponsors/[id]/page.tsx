import React from "react";
import { notFound } from "next/navigation";
import { getSponsorById } from "@/services/sponsors";
import SponsorDetailClient from "../_components/SponsorDetailClient";

// ─────────────────────────────────────────────
// Server Component — fetches single sponsor at request time
// ─────────────────────────────────────────────
export default async function SponsorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    notFound();
  }

  let sponsor;
  try {
    const response = await getSponsorById(numericId);
    sponsor = response.data;
  } catch {
    // getSponsorById throws on non-2xx (e.g. 404 from backend)
    notFound();
  }

  if (!sponsor) {
    notFound();
  }

  return <SponsorDetailClient sponsor={sponsor} />;
}