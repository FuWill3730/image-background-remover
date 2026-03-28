"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

const MOCK_ORDERS = [
  {
    id: "ORD-2024-001",
    productName: "Pro 月度套餐",
    amount: "9.90",
    status: "PAID",
    createdAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "ORD-2024-002",
    productName: "Pro 月度套餐",
    amount: "9.90",
    status: "PAID",
    createdAt: "2024-02-01T09:30:00Z",
  },
];

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  PAID: { label: "已支付", className: "bg-green-100 text-green-700" },
  PENDING: { label: "待支付", className: "bg-yellow-100 text-yellow-700" },
  FAILED: { label: "失败", className: "bg-red-100 text-red-700" },
  REFUNDED: { label: "已退款", className: "bg-gray-100 text-gray-500" },
};

type Tab = "info" | "orders";

export default function UserDropdown() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("info");
  const ref = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!session?.user) return null;
  const user = session.user;

  return (
    <div ref={ref} className="relative">
      {/* 头像触发按钮 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-2xl bg-white/80 backdrop-blur-sm px-3 py-1.5 ring-1 ring-gray-900/5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="avatar" className="w-8 h-8 rounded-xl object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">{user.name?.charAt(0) ?? "U"}</span>
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 hidden sm:inline max-w-[100px] truncate">
          {user.name}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown 面板 */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-80 glass rounded-2xl shadow-2xl ring-1 ring-gray-900/5 overflow-hidden animate-fade-in-up z-50"
          style={{ animationDuration: "0.15s" }}
        >
          {/* 用户信息头部 */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100/80">
            <div className="flex items-center gap-3">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="avatar" className="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow" />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow">
                  <span className="text-white font-bold">{user.name?.charAt(0) ?? "U"}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">免费版</span>
            </div>
          </div>

          {/* Tab 切换 */}
          <div className="flex border-b border-gray-100/80">
            {(["info", "orders"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                  tab === t
                    ? "text-indigo-600 border-b-2 border-indigo-500"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t === "info" ? "账号信息" : "订单记录"}
              </button>
            ))}
          </div>

          {/* Tab 内容 */}
          <div className="px-4 py-3">
            {tab === "info" && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2.5 ring-1 ring-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">当前套餐</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">免费版 · 每天 3 张</p>
                  </div>
                  <button
                    onClick={() => alert("支付功能即将上线！")}
                    className="shrink-0 inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1.5 text-xs font-semibold text-white shadow hover:shadow-md hover:scale-[1.03] transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    升级 Pro
                  </button>
                </div>
                <div className="rounded-xl bg-white/60 px-3 py-2.5 ring-1 ring-gray-100">
                  <p className="text-xs text-gray-400">登录方式</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Google 账号</span>
                  </div>
                </div>
              </div>
            )}

            {tab === "orders" && (
              <div className="space-y-2">
                {MOCK_ORDERS.length === 0 ? (
                  <div className="text-center py-6 text-gray-400">
                    <p className="text-sm">暂无订单记录</p>
                  </div>
                ) : (
                  MOCK_ORDERS.map((order) => {
                    const s = STATUS_MAP[order.status] ?? { label: order.status, className: "bg-gray-100 text-gray-500" };
                    return (
                      <div key={order.id} className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2.5 ring-1 ring-gray-100">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{order.productName}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                          </p>
                        </div>
                        <div className="shrink-0 flex items-center gap-2 ml-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.className}`}>{s.label}</span>
                          <span className="text-sm font-bold text-gray-900">${order.amount}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* 底部退出 */}
          <div className="px-4 pb-4">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/60 px-4 py-2.5 text-sm font-medium text-gray-600 ring-1 ring-gray-100 hover:bg-white hover:text-gray-900 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              退出登录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
