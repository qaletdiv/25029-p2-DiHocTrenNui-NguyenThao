import React from "react";
import { Images } from "lucide-react";
import { cookies } from "next/headers";
import PageShell from "@/components/member/common/PageShell";
import { getAllImages } from "@/services/images";
import { getAllStudents } from "@/services/students";
import ImageListClient from "./_components/ImageListClient";

// ─────────────────────────────────────────────
// Server Component — fetches data at request time
// ─────────────────────────────────────────────
export default async function ImagesPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageParam = searchParams?.page;
  const pageSizeParam = searchParams?.pageSize;

  const page = typeof pageParam === "string" ? parseInt(pageParam, 10) : 1;
  const pageSize = typeof pageSizeParam === "string" ? parseInt(pageSizeParam, 10) : 8;

  // 1. Fetch images (paginated)
  const imagesResponse = await getAllImages(page, pageSize);
  const isImagesPaginated = "images" in imagesResponse.data;
  const images = isImagesPaginated ? (imagesResponse.data as any).images : imagesResponse.data;
  const total = isImagesPaginated ? (imagesResponse.data as any).total : images.length;

  // 2. Fetch all students to map IDs to Names & for dropdown selection filter
  const studentsResponse = await getAllStudents();
  const isStudentsPaginated = "students" in studentsResponse.data;
  const students = isStudentsPaginated ? (studentsResponse.data as any).students : studentsResponse.data;

  // 3. Extract access token for client-side image proxy previews
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || "";

  return (
    <PageShell
      title="Thư viện Hình ảnh"
      subtitle={`${total} hình ảnh trong thư viện`}
      icon={Images}
      iconColor="bg-pink-100 text-pink-700"
    >
      <ImageListClient
        initialImages={images}
        students={students}
        total={total}
        initialPage={page}
        initialPageSize={pageSize}
        token={token}
      />
    </PageShell>
  );
}