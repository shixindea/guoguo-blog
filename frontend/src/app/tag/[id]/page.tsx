"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Hash, FileText, Plus, Share2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArticleList } from "@/components/ArticleList";
import { tagApi } from "@/api/tags";
import type { TagDTO } from "@/api/types";

export default function TagDetailPage() {
  const params = useParams<{ id: string }>();
  const tagId = Number(params.id);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tag, setTag] = useState<TagDTO | null>(null);
  const [relatedTags, setRelatedTags] = useState<TagDTO[]>([]);
  const [sortBy, setSortBy] = useState<"publishedAt" | "likeCount" | "commentCount">("publishedAt");

  useEffect(() => {
    if (!tagId) return;
    tagApi.detail(tagId).then(setTag);
    tagApi
      .popular()
      .then((list) => list.filter((t) => t.id !== tagId).slice(0, 10))
      .then(setRelatedTags);
  }, [tagId]);

  const tagName = tag?.name || "";
  const tagDescription = tag?.description || "";
  const articleCount = tag?.articleCount || 0;

  return (
    <main className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      
      {/* Tag Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 mb-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Hash className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">{tagName || "标签"}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {articleCount} 文章
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={cn(
                "flex-1 md:flex-none px-6 py-2.5 rounded-full font-medium transition-all flex items-center justify-center gap-2",
                isFollowing
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
              )}
            >
              {isFollowing ? "已关注" : (
                <>
                  <Plus className="w-4 h-4" /> 关注
                </>
              )}
            </button>
            <button className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <p className="mt-6 text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {tagDescription || "暂无描述"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Article List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">最新文章</h2>
            <div className="flex items-center gap-2">
               <select
                 className="bg-transparent text-sm text-slate-600 dark:text-slate-400 focus:outline-none cursor-pointer"
                 value={sortBy}
                 onChange={(e) => {
                   const v = e.target.value;
                   if (v === "publishedAt" || v === "likeCount" || v === "commentCount") {
                     setSortBy(v);
                   }
                 }}
               >
                 <option value="publishedAt">最新发布</option>
                 <option value="likeCount">最多点赞</option>
                 <option value="commentCount">最多评论</option>
               </select>
            </div>
          </div>
          
          <ArticleList showFilter={false} query={{ tagId, sortBy, order: "desc" }} />
        </div>

        {/* Right: Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Related Tags */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">相关标签</h3>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((t) => (
                <Link
                  key={t.id}
                  href={`/tag/${t.id}`} 
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
