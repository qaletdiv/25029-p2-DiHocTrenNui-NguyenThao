"use client";

import React, { useState, useEffect } from "react";
import { UserCircle, Camera, Save, KeyRound, Bell, Shield } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import { getCurrentAccount, updateAccount, type Account } from "@/services/accounts";

type TabId = "info" | "security" | "notifications";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  { id: "info", label: "Thông tin cá nhân", icon: UserCircle },
  { id: "security", label: "Bảo mật", icon: KeyRound },
  { id: "notifications", label: "Thông báo", icon: Bell },
];

/* ── Reusable field row ─────────────────────────────────── */
function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  disabled,
}: {
  label: string;
  id: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
      />
    </div>
  );
}

/* ── Toggle row for notification settings ───────────────── */
function NotifRow({ label, desc, defaultChecked }: { label: string; desc: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked ?? false);
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <button
        role="switch"
        aria-checked={on}
        onClick={() => setOn(!on)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
          on ? "bg-primary-900" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
            on ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>("info");
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Password states
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  // Feedback states
  const [infoMessage, setInfoMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [securityMessage, setSecurityMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getCurrentAccount();
        if (data) {
          setAccount(data);
          setUsername(data.username || "");
          setEmail(data.email || "");
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) {
    return (
      <PageShell
        title="Hồ sơ cá nhân"
        subtitle="Quản lý thông tin tài khoản của bạn"
        icon={UserCircle}
        iconColor="bg-primary-900/10 text-primary-900"
      >
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-900 border-t-transparent"></div>
        </div>
      </PageShell>
    );
  }

  if (!account) {
    return (
      <PageShell
        title="Hồ sơ cá nhân"
        subtitle="Quản lý thông tin tài khoản của bạn"
        icon={UserCircle}
        iconColor="bg-primary-900/10 text-primary-900"
      >
        <div className="text-center py-12">
          <p className="text-red-500 font-medium">Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.</p>
        </div>
      </PageShell>
    );
  }

  const ROLE_MAP: Record<number, { code: string; name: string }> = {
    1: { code: "ADMIN", name: "Quản trị viên" },
    2: { code: "VOLUNTEER", name: "Tình nguyện viên" },
    3: { code: "TEACHER", name: "Giáo viên" },
    4: { code: "SPONSOR", name: "Nhà tài trợ" },
  };

  const currentRole = ROLE_MAP[account.role_id] || { code: "USER", name: "Người dùng" };
  const firstLetter = (account.username || "A").charAt(0).toUpperCase();

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMessage(null);
    try {
      const res = await updateAccount(account.id, { username, email });
      if (res.status === "success" || res.data) {
        setAccount(res.data);
        setInfoMessage({ type: "success", text: "Cập nhật thông tin cá nhân thành công!" });
      } else {
        setInfoMessage({ type: "error", text: "Cập nhật thông tin thất bại." });
      }
    } catch (err: any) {
      setInfoMessage({
        type: "error",
        text: err.message || "Đã xảy ra lỗi trong quá trình cập nhật.",
      });
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage(null);

    if (!newPwd) {
      setSecurityMessage({ type: "error", text: "Vui lòng nhập mật khẩu mới." });
      return;
    }

    if (newPwd !== confirmPwd) {
      setSecurityMessage({ type: "error", text: "Mật khẩu mới và xác nhận mật khẩu không khớp." });
      return;
    }

    try {
      const res = await updateAccount(account.id, { password: newPwd });
      if (res.status === "success" || res.data) {
        setSecurityMessage({ type: "success", text: "Cập nhật mật khẩu thành công!" });
        setCurrentPwd("");
        setNewPwd("");
        setConfirmPwd("");
      } else {
        setSecurityMessage({ type: "error", text: "Cập nhật mật khẩu thất bại." });
      }
    } catch (err: any) {
      setSecurityMessage({
        type: "error",
        text: err.message || "Đã xảy ra lỗi khi cập nhật mật khẩu.",
      });
    }
  };

  return (
    <PageShell
      title="Hồ sơ cá nhân"
      subtitle="Quản lý thông tin tài khoản của bạn"
      icon={UserCircle}
      iconColor="bg-primary-900/10 text-primary-900"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Left: Avatar card ────────────────────────────── */}
        <div className="flex-shrink-0 w-full lg:w-64">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary-900 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-primary-900/10">
                {firstLetter}
              </div>
              <button
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary-900 hover:border-primary-700 transition-colors shadow-sm"
                aria-label="Đổi ảnh đại diện"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="text-center">
              <p className="font-bold text-gray-800">{account.username}</p>
              <p className="text-xs text-gray-500 mt-0.5">{currentRole.name}</p>
            </div>

            {/* Role badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-900/10 text-primary-900 text-xs font-semibold rounded-full">
              <Shield size={12} />
              {currentRole.code}
            </span>

            {/* Stats mini */}
            <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              {[
                { label: "Đăng nhập", value: "248" },
                { label: "Hoạt động", value: "91 ngày" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-bold text-gray-800 text-sm">{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Tab panel ────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Tab bar */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-white text-primary-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700",
                ].join(" ")}
              >
                <tab.icon size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab: Personal info */}
          {activeTab === "info" && (
            <form onSubmit={handleSaveInfo} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h3 className="text-base font-semibold text-gray-700">Thông tin cơ bản</h3>
              
              {infoMessage && (
                <div
                  className={`p-4 rounded-xl text-sm ${
                    infoMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-red-50 text-red-700 border border-red-100"
                  }`}
                >
                  {infoMessage.text}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Họ và tên / Username"
                  id="fullName"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Field
                  label="Tên hiển thị"
                  id="displayName"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Field
                  label="Email"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Field
                  label="Số điện thoại"
                  id="phone"
                  type="tel"
                  value="0901 234 567"
                  disabled
                />
                <Field
                  label="Chức danh"
                  id="role"
                  value={currentRole.name}
                  disabled
                />
                <Field
                  label="Ngày tham gia"
                  id="joinedAt"
                  value="2023-01-01"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="bio" className="text-sm font-medium text-gray-600">Giới thiệu</label>
                <textarea
                  id="bio"
                  rows={3}
                  defaultValue="Quản trị viên hệ thống chương trình Đi Học Trên Núi."
                  className="mt-1.5 w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors resize-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled
                />
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-900 hover:bg-primary-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all">
                  <Save size={15} />
                  Lưu thay đổi
                </button>
              </div>
            </form>
          )}

          {/* Tab: Security */}
          {activeTab === "security" && (
            <form onSubmit={handleSaveSecurity} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h3 className="text-base font-semibold text-gray-700">Đổi mật khẩu</h3>

              {securityMessage && (
                <div
                  className={`p-4 rounded-xl text-sm ${
                    securityMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-red-50 text-red-700 border border-red-100"
                  }`}
                >
                  {securityMessage.text}
                </div>
              )}

              <div className="space-y-4 max-w-md">
                <Field
                  label="Mật khẩu hiện tại"
                  id="currentPwd"
                  type="password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                />
                <Field
                  label="Mật khẩu mới"
                  id="newPwd"
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                />
                <Field
                  label="Xác nhận mật khẩu mới"
                  id="confirmPwd"
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                />
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-900 hover:bg-primary-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all">
                  <KeyRound size={15} />
                  Cập nhật mật khẩu
                </button>
              </div>
            </form>
          )}

          {/* Tab: Notifications */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-700 mb-4">Tuỳ chọn thông báo</h3>
              <div className="divide-y divide-gray-50">
                <NotifRow label="Thông báo giao dịch mới" desc="Nhận thông báo khi có giao dịch thu/chi được ghi nhận" defaultChecked />
                <NotifRow label="Thêm học sinh mới" desc="Thông báo khi có học sinh mới được thêm vào hệ thống" defaultChecked />
                <NotifRow label="Nhà tài trợ đăng ký" desc="Thông báo khi có nhà tài trợ mới đăng ký" defaultChecked />
                <NotifRow label="Báo cáo tháng" desc="Nhận báo cáo tổng hợp vào cuối mỗi tháng qua email" />
                <NotifRow label="Cảnh báo hệ thống" desc="Thông báo lỗi hoặc sự cố kỹ thuật quan trọng" defaultChecked />
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}