// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
export function calcAge(dob: string) {
    const b = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - b.getFullYear();
    if (
        now.getMonth() < b.getMonth() ||
        (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())
    )
        age--;
    return age;
}

export function fmtDate(iso: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function fmtDateTime(iso: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function fmtAmount(n: number) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(n);
}