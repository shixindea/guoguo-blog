"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Hash, Users, FileText, Plus, Share2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArticleList } from "@/components/ArticleList";

// Mock Data
const TAG_INFO = {
  id: "1",
  name: "React",
  description: "用于构建用户界面的 JavaScript 库。React 主要用于构建 UI，很多人认为 React 是 MVC 中的 V（视图）。React 起源于 Facebook 的内部项目，用来架设 Instagram 的网站，并于 2013 年 5 月开源。",
  articlesCount: 1250,
  followersCount: 5600,
  isFollowing: false,
  relatedTags: ["Next.js", "JavaScript", "Redux", "Hooks", "Frontend"],
  activeUsers: [
    { id: 1, name: "Dan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dan" },
    { id: 2, name: "Andrew", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andrew" },
    { id: 3, name: "Sophie", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie" },
    { id: 4, name: "Sebastian", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sebastian" },
  ]
};

export default function TagDetailPage() {
  const params = useParams();
  const [isFollowing, setIsFollowing] = useState(TAG_INFO.isFollowing);

  // In a real app, fetch tag info using params.id
  // For demo, we just use the mock data but maybe change the name if id is different
  const tag = { ...TAG_INFO, id: params.id as string, name: (params.id as string) === "1" ? "React" : (params.id as string) };

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
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">{tag.name}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {tag.articlesCount} 文章
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {tag.followersCount} 关注
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
          {tag.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Article List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">最新文章</h2>
            <div className="flex items-center gap-2">
               <select className="bg-transparent text-sm text-slate-600 dark:text-slate-400 focus:outline-none cursor-pointer">
                 <option>最新发布</option>
                 <option>最多点赞</option>
                 <option>最多评论</option>
               </select>
            </div>
          </div>
          
          <ArticleList showFilter={false} />
        </div>

        {/* Right: Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Related Tags */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">相关标签</h3>
            <div className="flex flex-wrap gap-2">
              {tag.relatedTags.map((t) => (
                <Link
                  key={t}
                  href={`/tag/${t}`} 
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
             <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">活跃贡献者</h3>
             <div className="flex -space-x-2 overflow-hidden mb-4">
                {tag.activeUsers.map((user) => (
                  <img
                    key={user.id}
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-900"
                    src={user.avatar}
                    alt={user.name}
                  />
                ))}
                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-500 ring-2 ring-white dark:ring-slate-900">
                  +20
                </div>
             </div>
             <p className="text-sm text-slate-500">
               最近有 24 位作者在此标签下发布了内容
             </p>
          </div>

        </div>
      </div>
    </main>
  );
}
