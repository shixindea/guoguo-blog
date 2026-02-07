"use client";
import { ThumbsUp, MessageSquare, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { articleApi } from "@/api/articles";
import type { ArticleListItem, PageResponse } from "@/api/types";

interface ArticleListProps {
  articles?: ArticleListItem[];
  showFilter?: boolean;
  query?: {
    sortBy?: string;
    order?: string;
    status?: string;
    categoryId?: number;
    tagId?: number;
    userId?: number;
    keyword?: string;
  };
}

function formatCount(n?: number) {
  const v = n || 0;
  return new Intl.NumberFormat("zh-CN").format(v);
}

function formatRelative(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  return date.toISOString().slice(0, 10);
}

export function ArticleList({ articles, showFilter = true, query }: ArticleListProps) {
  const [page, setPage] = useState<PageResponse<ArticleListItem> | null>(null);
  const [loading, setLoading] = useState(false);

  const effectiveQuery = useMemo(() => query || {}, [query]);

  useEffect(() => {
    if (articles) return;
    setLoading(true);
    articleApi
      .list({ page: 1, size: 20, sortBy: effectiveQuery.sortBy, order: effectiveQuery.order, status: effectiveQuery.status, categoryId: effectiveQuery.categoryId, tagId: effectiveQuery.tagId, userId: effectiveQuery.userId, keyword: effectiveQuery.keyword })
      .then(setPage)
      .finally(() => setLoading(false));
  }, [articles, effectiveQuery]);

  const list = articles || page?.list || [];
  return (
    <div className="space-y-4">
        {showFilter && (
        <div className="flex items-center gap-6 mb-4 bg-white dark:bg-slate-900 px-6 py-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <button className="flex items-center gap-2 text-blue-600 font-bold text-sm relative">
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-600 rounded-full"></span>
                🔥 热门推荐
            </button>
            <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 text-sm transition-colors">
                🕒 最新发布
            </button>
        </div>
        )}

      {loading && list.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 text-slate-500">
          加载中...
        </div>
      )}

      {list.map((article) => (
        <article
          key={article.id}
          className="bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-800 group cursor-pointer hover:-translate-y-0.5 duration-300"
        >
          <Link href={`/article/${article.id}`} className="block p-6">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-1">
                    <div className="flex items-center gap-2">
                        <img src={article.author.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt={article.author.displayName || article.author.username} className="w-5 h-5 rounded-full" />
                        <span className="font-medium text-slate-900 dark:text-slate-200 hover:text-blue-600 transition-colors">
                          {article.author.displayName || article.author.username}
                        </span>
                    </div>
                    <span className="w-0.5 h-0.5 bg-slate-300 rounded-full"></span>
                    <span>{formatRelative(article.publishedAt || article.createdAt)}</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                    {article.title}
                </h3>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">
                {article.summary}
                </p>
                
                <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    {article.tags.map(tag => (
                        <span key={tag.id} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-full hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-700">
                            {tag.name}
                        </span>
                    ))}
                </div>
                
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        <span>{formatCount(article.viewCount)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{formatCount(article.likeCount)}</span>
                    </div>
                </div>
                </div>
            </div>
          </Link>
        </article>
      ))}
      
      {/* Skeleton / Loading more */}
      <div className="py-6 flex justify-center">
        <button className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm">
            加载更多内容
        </button>
      </div>
    </div>
  );
}
