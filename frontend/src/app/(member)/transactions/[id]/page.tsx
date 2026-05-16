interface TransactionDetailPageProps {
  params: { id: string };
}

export default function TransactionDetailPage({
  params,
}: TransactionDetailPageProps) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-800">
        Chi tiết Giao dịch — {params.id}
      </h1>
      <p className="text-gray-500 mt-2 text-sm">
        Trang chi tiết đang được xây dựng.
      </p>
    </div>
  );
}
