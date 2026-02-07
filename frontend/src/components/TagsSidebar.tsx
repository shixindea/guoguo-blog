"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { tagApi } from "@/api/tags";
import { articleApi } from "@/api/articles";
import type { ArticleListItem, TagDTO } from "@/api/types";

function formatCount(n?: number) {
  const v = n || 0;
  return new Intl.NumberFormat("zh-CN").format(v);
}

export function TagsSidebar() {
  const [popularTags, setPopularTags] = useState<TagDTO[]>([]);
  const [hotTopics, setHotTopics] = useState<ArticleListItem[]>([]);

  useEffect(() => {
    tagApi.popular().then((list) => setPopularTags(list.slice(0, 14)));
    articleApi
      .list({ page: 1, size: 5, sortBy: "commentCount", order: "desc" })
      .then((page) => setHotTopics(page.list));
  }, []);

  return (
    <div className="space-y-6">
      {/* Tags */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-l-4 border-blue-600 pl-3">热门标签</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.id}`}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-700"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Hot Topics */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-l-4 border-blue-600 pl-3">本周热议</h3>
        <ul className="space-y-5">
          {hotTopics.map((topic) => (
            <li key={topic.id} className="group">
              <Link href={`/article/${topic.id}`} className="block">
                <div className="flex gap-2 items-start">
                  <span className="text-orange-500 text-xs mt-1">🔥</span>
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors leading-snug">
                    {topic.title}
                  </h4>
                </div>
                <div className="flex items-center gap-1 mt-1 pl-6">
                  <span className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    💬 {formatCount(topic.commentCount)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
       <div className="fixed bottom-8 right-8 md:hidden z-40">
           <button className="w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-600/40 flex items-center justify-center text-white active:scale-95 transition-transform">
                <Plus className="w-8 h-8" />
           </button>
       </div>
    </div>
  );
}
