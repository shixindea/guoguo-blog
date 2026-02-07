"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, TrendingUp, Hash, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryApi } from "@/api/categories";
import { tagApi } from "@/api/tags";
import { articleApi } from "@/api/articles";
import { notify } from "@/lib/notify";
import type { CategoryDTO, TagDTO } from "@/api/types";

function formatCount(n?: number) {
  const v = n || 0;
  return new Intl.NumberFormat("zh-CN").format(v);
}

export default function TagsPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined);
  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [popularTags, setPopularTags] = useState<TagDTO[]>([]);
  const [categoryTags, setCategoryTags] = useState<TagDTO[] | null>(null);

  useEffect(() => {
    categoryApi.list().then(setCategories);
    tagApi.popular().then(setPopularTags);
  }, []);

  useEffect(() => {
    if (!activeCategoryId) {
      setCategoryTags(null);
      return;
    }
    articleApi
      .list({ page: 1, size: 100, categoryId: activeCategoryId, sortBy: "viewCount", order: "desc" })
      .then((page) => {
        const counter = new Map<number, { tag: TagDTO; count: number }>();
        page.list.forEach((a) => {
          a.tags.forEach((t) => {
            const existing = counter.get(t.id);
            if (existing) {
              existing.count += 1;
            } else {
              counter.set(t.id, { tag: t, count: 1 });
            }
          });
        });
        const list = Array.from(counter.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 24)
          .map((x) => ({ ...x.tag, slug: x.tag.slug || String(x.tag.id), articleCount: x.count }));
        setCategoryTags(list);
      });
  }, [activeCategoryId]);

  const displayTags = useMemo(() => {
    const base = categoryTags ?? popularTags;
    const q = keyword.trim().toLowerCase();
    if (!q) return base;
    return base.filter((t) => t.name.toLowerCase().includes(q));
  }, [categoryTags, popularTags, keyword]);

  const risingTags = useMemo(() => {
    return popularTags.slice(0, 5).map((t) => ({
      id: t.id,
      name: t.name,
      value: `+${Math.max(1, Math.floor((t.articleCount || 0) / 20))}%`,
    }));
  }, [popularTags]);

  return (
    <main className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      {/* Header */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          探索技术标签
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          发现热门技术话题，关注你感兴趣的领域
        </p>
        
        {/* Search */}
        <div className="relative max-w-lg mx-auto group">
          <input
            type="text"
            placeholder="搜索标签..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full px-6 py-3 pl-12 bg-white dark:bg-slate-900 rounded-full shadow-lg shadow-blue-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Main Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveCategoryId(undefined)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                activeCategoryId === undefined
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              )}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  activeCategoryId === cat.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Popular Tags Cloud */}
          <div>
             <div className="flex items-center gap-2 mb-6">
              <Hash className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">热门标签</h2>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {displayTags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.id}`}
                  className="group relative flex items-center gap-3 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
                >
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tag.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {formatCount(tag.articleCount)} 文章
                    </div>
                  </div>
                  <span className="text-xs font-medium text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">
                    推荐
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Rising Stars */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">24h 飙升榜</h2>
            </div>
            
            <div className="space-y-4">
              {risingTags.map((tag, index) => (
                <div key={tag.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold",
                      index < 3 ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                    )}>
                      {index + 1}
                    </span>
                    <Link href={`/tag/${tag.id}`} className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                      {tag.name}
                    </Link>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-orange-500">
                    <Activity className="w-3 h-3" />
                    {tag.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
           {/* Discover More */}
           <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
              <h3 className="text-lg font-bold mb-2">没有找到感兴趣的标签？</h3>
              <p className="text-blue-100 text-sm mb-4">
                你可以申请创建新标签，或查看更多分类。
              </p>
              <button
                type="button"
                onClick={() => notify("暂未开放创建标签功能")}
                className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-medium transition-colors text-sm"
              >
                申请创建标签
              </button>
           </div>

        </div>
      </div>
    </main>
  );
}
