import React from "react";
interface StudentTableProps {}
export default function StudentTable({}: StudentTableProps) {
    return (
        <div>
            <h1>Danh sách học sinh</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Mã số</th>
                        <th className="py-2 px-4 border-b">Tên</th>
                        <th className="py-2 px-4 border-b">Địa chỉ</th>
                        <th className="py-2 px-4 border-b">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Dữ liệu học sinh sẽ được hiển thị ở đây */}
                </tbody>
            </table>
        </div>
    );
}