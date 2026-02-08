"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Search, Trash2, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { historyApi } from "@/api/histories";
import type { HistoryItemDTO, PageResponse } from "@/api/types";

type HistoryGroup = { dateLabel: string; items: HistoryItemDTO[] };

export default function HistoryPage() {
  const { isAuthenticated, isLoading: authLoading, openLoginModal, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState<PageResponse<HistoryItemDTO> | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) return;
    setLoading(true);
    historyApi
      .list({ page: 1, size: 100 })
      .then(setPage)
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated]);

  const filteredItems = useMemo(() => {
    const list = page?.list || [];
    if (!keyword.trim()) return list;
    const k = keyword.trim().toLowerCase();
    return list.filter((i) => (i.article.title || "").toLowerCase().includes(k));
  }, [page, keyword]);

  const groups = useMemo<HistoryGroup[]>(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const todayItems: HistoryItemDTO[] = [];
    const yesterdayItems: HistoryItemDTO[] = [];
    const olderItems: HistoryItemDTO[] = [];

    for (const item of filteredItems) {
      const d = (item.lastReadAt || "").slice(0, 10);
      if (d === todayStr) {
        todayItems.push(item);
      } else if (d === yesterdayStr) {
        yesterdayItems.push(item);
      } else {
        olderItems.push(item);
      }
    }

    const result: HistoryGroup[] = [];
    if (todayItems.length) result.push({ dateLabel: "今天", items: todayItems });
    if (yesterdayItems.length) result.push({ dateLabel: "昨天", items: yesterdayItems });
    if (olderItems.length) result.push({ dateLabel: "更早", items: olderItems });
    return result;
  }, [filteredItems]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">浏览历史</h1>
           <p className="text-slate-500">查看你的阅读足迹和进度</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="搜索历史记录..." 
                    className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <Button
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
              disabled={loading}
              onClick={() => {
                checkAuth(async () => {
                  await historyApi.clear();
                  const next = await historyApi.list({ page: 1, size: 100 });
                  setPage(next);
                });
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" /> 清空
            </Button>
        </div>
      </div>

      {!authLoading && !isAuthenticated && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="font-medium text-slate-900 dark:text-white">你还未登录</div>
            <div className="text-sm text-slate-500">登录后才能查看浏览历史</div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={openLoginModal}>
            登录
          </Button>
        </div>
      )}

      <div className="space-y-8 relative">
         {/* Vertical Line */}
         <div className="absolute left-3 top-2 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -z-10 hidden md:block"></div>

         {loading && <div className="text-slate-500">加载中...</div>}
         {!loading && isAuthenticated && filteredItems.length === 0 && <div className="text-slate-500">暂无历史记录</div>}

         {groups.map((group) => (
            <div key={group.dateLabel} className="relative">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-950 shadow-sm z-10">
                        <Calendar className="w-3 h-3" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{group.dateLabel}</h3>
                </div>

                <div className="md:ml-9 space-y-3">
                    {group.items.map((item) => (
                        <div key={item.id} className="group bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
                            {/* Progress Ring or Icon */}
                            <div className="relative w-12 h-12 shrink-0">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <path className="text-blue-600 drop-shadow-sm" strokeDasharray={`${Math.min(Math.max(Number(item.progress || 0), 0), 100)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                    {Math.min(Math.max(Number(item.progress || 0), 0), 100)}%
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <Link href={`/article/${item.article.id}`} className="block">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 truncate group-hover:text-blue-600 transition-colors">
                                        {item.article.title}
                                    </h4>
                                </Link>
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <span>{item.article.author?.displayName || item.article.author?.username || "-"}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {(item.lastReadAt || "").slice(11, 16) || "-"}
                                    </span>
                                </div>
                            </div>

                            <button
                              className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                              onClick={() => {
                                checkAuth(async () => {
                                  await historyApi.remove(item.id);
                                  const next = await historyApi.list({ page: 1, size: 100 });
                                  setPage(next);
                                });
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
         ))}
      </div>
    </div>
  );
}
