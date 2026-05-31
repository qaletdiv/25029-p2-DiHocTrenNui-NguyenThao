import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export function usePagination(initialPage = 1, initialPageSize = 10) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string, 10)
    : initialPage;
  const pageSize = searchParams.get("pageSize")
    ? parseInt(searchParams.get("pageSize") as string, 10)
    : initialPageSize;

  const setPageAndSize = useCallback(
    (newPage: number, newPageSize: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      params.set("pageSize", newPageSize.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const setPage = useCallback(
    (newPage: number) => {
      setPageAndSize(newPage, pageSize);
    },
    [pageSize, setPageAndSize]
  );

  const setPageSize = useCallback(
    (newPageSize: number) => {
      setPageAndSize(1, newPageSize);
    },
    [setPageAndSize]
  );

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    setPageAndSize,
  };
}
