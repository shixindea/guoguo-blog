"use client";
import { ThumbsUp, Eye } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [items, setItems] = useState<ArticleListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | undefined>(query?.sortBy);
  const [order, setOrder] = useState<string | undefined>(query?.order);
  const [loading, setLoading] = useState(false);

  const effectiveQuery = useMemo(() => query || {}, [query]);
  const queryKey = useMemo(() => {
    return [
      effectiveQuery.status ?? "",
      effectiveQuery.categoryId ?? "",
      effectiveQuery.tagId ?? "",
      effectiveQuery.userId ?? "",
      effectiveQuery.keyword ?? "",
      effectiveQuery.sortBy ?? "",
      effectiveQuery.order ?? "",
      showFilter ? "1" : "0",
    ].join("|");
  }, [effectiveQuery, showFilter]);

  useEffect(() => {
    if (!showFilter) {
      setSortBy(effectiveQuery.sortBy);
      setOrder(effectiveQuery.order);
      return;
    }
    const s = effectiveQuery.sortBy;
    if (s === "publishedAt" || s === "published_at") {
      setSortBy("publishedAt");
      setOrder("desc");
    } else if (s) {
      setSortBy(s);
      setOrder(effectiveQuery.order || "desc");
    } else {
      setSortBy("viewCount");
      setOrder("desc");
    }
  }, [effectiveQuery.sortBy, effectiveQuery.order, showFilter]);

  const loadPage = useCallback((pageNo: number, mode: "replace" | "append") => {
    setLoading(true);
    return articleApi
      .list({
        page: pageNo,
        size: 20,
        sortBy: sortBy,
        order: order,
        status: effectiveQuery.status,
        categoryId: effectiveQuery.categoryId,
        tagId: effectiveQuery.tagId,
        userId: effectiveQuery.userId,
        keyword: effectiveQuery.keyword,
      })
      .then((res) => {
        setPage(res);
        setCurrentPage(pageNo);
        if (mode === "append") {
          setItems((prev) => [...prev, ...res.list]);
        } else {
          setItems(res.list);
        }
      })
      .finally(() => setLoading(false));
  }, [effectiveQuery.categoryId, effectiveQuery.keyword, effectiveQuery.status, effectiveQuery.tagId, effectiveQuery.userId, order, sortBy]);

  useEffect(() => {
    if (articles) return;
    loadPage(1, "replace");
  }, [articles, loadPage, queryKey, sortBy, order]);

  const list = articles || (items.length ? items : page?.list || []);
  const total = page?.total || 0;
  const hasMore = !articles && total > 0 && list.length < total;
  const hotActive = showFilter && (sortBy === "viewCount" || sortBy === "likeCount");
  const newActive = showFilter && sortBy === "publishedAt";
  return (
    <div className="space-y-4">
        {showFilter && (
        <div className="flex items-center gap-6 mb-4 bg-white dark:bg-slate-900 px-6 py-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <button
              type="button"
              className={`flex items-center gap-2 font-bold text-sm relative ${hotActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"}`}
              onClick={() => {
                setSortBy("viewCount");
                setOrder("desc");
              }}
            >
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-600 rounded-full"></span>
                🔥 热门推荐
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 text-sm transition-colors ${newActive ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"}`}
              onClick={() => {
                setSortBy("publishedAt");
                setOrder("desc");
              }}
            >
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
                        <Link key={tag.id} href={`/tag/${tag.id}`} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-full hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-700">
                            {tag.name}
                        </Link>
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
        {!articles && (
          <button
            type="button"
            className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !hasMore}
            onClick={() => loadPage(currentPage + 1, "append")}
          >
            {hasMore ? (loading ? "加载中..." : "加载更多内容") : "没有更多了"}
          </button>
        )}
      </div>
    </div>
  );
}
