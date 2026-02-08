"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookMarked, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { collectionApi } from "@/api/collections";
import type { CollectionItemDTO, PageResponse } from "@/api/types";

export default function CollectionsPage() {
  const { isAuthenticated, isLoading: authLoading, openLoginModal, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<PageResponse<CollectionItemDTO> | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) return;
    setLoading(true);
    collectionApi
      .list({ page: 1, size: 50 })
      .then(setPage)
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated]);

  const items = page?.list || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">我的收藏</h1>
           <p className="text-slate-500">管理你的知识库和阅读清单</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {
            if (!isAuthenticated) openLoginModal();
          }}
        >
          管理收藏
        </Button>
      </div>

      {!authLoading && !isAuthenticated && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="font-medium text-slate-900 dark:text-white">你还未登录</div>
            <div className="text-sm text-slate-500">登录后才能查看收藏内容</div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={openLoginModal}>
            登录
          </Button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-blue-600" />
            收藏文章
          </div>
          <div className="text-sm text-slate-500">{page?.total ?? 0} 条</div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {loading && <div className="p-6 text-slate-500">加载中...</div>}
          {!loading && items.length === 0 && <div className="p-6 text-slate-500">暂无收藏</div>}
          {items.map((item) => (
            <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                {item.article.coverImage ? (
                  <img src={item.article.coverImage} alt={item.article.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <BookMarked className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link href={`/article/${item.article.id}`} className="block">
                  <div className="font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                    {item.article.title}
                  </div>
                </Link>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                  <span>{item.article.author?.displayName || item.article.author?.username || "-"}</span>
                  <span>{(item.collectedAt || "").slice(0, 10)}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-600"
                onClick={() => {
                  checkAuth(async () => {
                    await collectionApi.remove(item.article.id);
                    const next = await collectionApi.list({ page: 1, size: 50 });
                    setPage(next);
                  });
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
