"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Mock 订单数据，后续接入 PayPal 后替换为真实 API
const MOCK_ORDERS = [
  {
    id: "ORD-2024-001",
    productName: "Pro 月度套餐",
    amount: "9.90",
    currency: "USD",
    status: "PAID",
    createdAt: "2024-03-01T10:00:00Z",
    paidAt: "2024-03-01T10:01:00Z",
  },
  {
    id: "ORD-2024-002",
    productName: "Pro 月度套餐",
    amount: "9.90",
    currency: "USD",
    status: "PAID",
    createdAt: "2024-02-01T09:30:00Z",
    paidAt: "2024-02-01T09:31:00Z",
  },
];

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  PAID: { label: "已支付", className: "bg-green-100 text-green-700" },
  PENDING: { label: "待支付", className: "bg-yellow-100 text-yellow-700" },
  FAILED: { label: "失败", className: "bg-red-100 text-red-700" },
  REFUNDED: { label: "已退款", className: "bg-gray-100 text-gray-500" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 未登录重定向到首页
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  // 加载中
  if (status === "loading") {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="glass rounded-3xl p-12 text-center shadow-xl animate-fade-in">
          <div className="relative mx-auto mb-4 h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
          </div>
          <p className="text-gray-500 text-sm">加载中...</p>
        </div>
      </main>
    );
  }

  // 未登录（useEffect 会跳转，但渲染一个过渡态避免闪烁）
  if (status === "unauthenticated") {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="glass rounded-3xl p-12 text-center shadow-xl animate-fade-in">
          <p className="text-gray-500 mb-6">请先登录后访问个人中心</p>
          <button
            onClick={() => signIn("google")}
            className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-3.5 font-semibold text-gray-700 shadow-lg ring-1 ring-gray-900/5 hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            使用 Google 登录
          </button>
        </div>
      </main>
    );
  }

  const user = session!.user!;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-200/60 to-indigo-300/60 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-purple-200/60 to-pink-300/60 blur-3xl animate-float-delayed" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-10 animate-fade-in">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
          <span className="text-sm font-semibold text-gray-400 tracking-widest uppercase">个人中心</span>
        </div>

        {/* 用户信息卡片 */}
        <div className="glass rounded-3xl p-8 shadow-xl mb-6 animate-fade-in-up">
          <div className="flex items-center gap-6">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt="头像"
                className="w-20 h-20 rounded-2xl ring-4 ring-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">
                  {user.name?.charAt(0) ?? "U"}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 truncate">{user.name}</h1>
              <p className="text-gray-500 text-sm mt-1 truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-200">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Google 账号
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                  免费版
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 套餐状态 */}
        <div className="glass rounded-3xl p-6 shadow-lg mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">当前套餐</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">免费版</p>
              <p className="text-sm text-gray-500 mt-0.5">每天可处理 3 张图片</p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => alert("支付功能即将上线！")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              升级 Pro
            </button>
          </div>
        </div>

        {/* 订单历史 */}
        <div className="glass rounded-3xl p-6 shadow-lg mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">订单记录</h2>
          {MOCK_ORDERS.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <svg className="w-10 h-10 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm">暂无订单记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {MOCK_ORDERS.map((order) => {
                const s = STATUS_MAP[order.status] ?? { label: order.status, className: "bg-gray-100 text-gray-500" };
                return (
                  <div key={order.id} className="flex items-center justify-between rounded-2xl bg-white/60 px-5 py-4 ring-1 ring-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{order.productName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)} · {order.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.className}`}>{s.label}</span>
                      <span className="text-sm font-bold text-gray-900">${order.amount}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 账号操作 */}
        <div className="glass rounded-3xl p-6 shadow-lg animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">账号操作</h2>
          <div className="space-y-3">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 rounded-2xl bg-white/60 px-5 py-3.5 text-sm font-medium text-gray-700 ring-1 ring-gray-100 hover:bg-white hover:shadow-sm transition-all text-left"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              退出登录
            </button>
            <button
              onClick={() => {
                if (confirm("确定要注销账号吗？此操作不可恢复。")) {
                  alert("账号注销功能即将上线");
                }
              }}
              className="w-full flex items-center gap-3 rounded-2xl bg-red-50/60 px-5 py-3.5 text-sm font-medium text-red-500 ring-1 ring-red-100 hover:bg-red-50 hover:shadow-sm transition-all text-left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              注销账号
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pb-6">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-300" />
            智抠图
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-300" />
          </div>
        </footer>
      </div>
    </main>
  );
}
