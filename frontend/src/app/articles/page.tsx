"use client";

import { useEffect, useState } from "react";
import { ArticleList } from "@/components/ArticleList";
import { tagApi } from "@/api/tags";
import { categoryApi } from "@/api/categories";
import type { CategoryDTO, TagDTO } from "@/api/types";
import { cn } from "@/lib/utils";

export default function ArticlesPage() {
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [activeTagId, setActiveTagId] = useState<number | undefined>(undefined);
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined);

  useEffect(() => {
    tagApi.popular().then((list) => setTags(list.slice(0, 8)));
    categoryApi.list().then(setCategories);
  }, []);

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">探索技术文章</h1>
        <p className="text-slate-500 text-lg">发现最新的技术趋势和开发实践</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mb-4 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveCategoryId(undefined)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap border",
            activeCategoryId === undefined
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border-blue-600"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700"
          )}
        >
          全部分类
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCategoryId(c.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap border",
              activeCategoryId === c.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border-blue-600"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Tags Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-8 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveTagId(undefined)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap border",
            activeTagId === undefined
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border-blue-600"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700"
          )}
        >
          全部
        </button>
        {tags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => setActiveTagId(tag.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap border",
              activeTagId === tag.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border-blue-600"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700"
            )}
          >
            {tag.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12">
            <ArticleList query={{ tagId: activeTagId, categoryId: activeCategoryId }} />
          </div>
      </div>
    </div>
  );
}
