"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookMarked, 
  History, 
  Users, 
  Settings, 
  FileText,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "数据概览", icon: LayoutDashboard },
  { href: "/dashboard/articles", label: "内容管理", icon: FileText },
  { href: "/dashboard/collections", label: "我的收藏", icon: BookMarked },
  { href: "/dashboard/history", label: "浏览历史", icon: History },
  { href: "/dashboard/following", label: "关注/粉丝", icon: Users },
  { href: "/dashboard/settings", label: "账号设置", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
            
            {/* User Info */}
            <div className="flex flex-col items-center mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
               <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] mb-4">
                 <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
                 </div>
               </div>
               <h2 className="text-xl font-bold text-slate-900 dark:text-white">张晓明</h2>
               <p className="text-sm text-slate-500">资深前端工程师</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

             <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-medium text-sm">
                   <LogOut className="w-5 h-5" />
                   退出登录
                </button>
             </div>

          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9">
          {children}
        </main>
      </div>
    </div>
  );
}
