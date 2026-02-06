"use client";

import { useState } from "react";
import { Folder, MoreVertical, Plus, Lock, Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock Data
const COLLECTIONS = [
  { id: 1, name: "React 进阶学习", count: 12, private: false, updated: "2天前", cover: "bg-blue-500" },
  { id: 2, name: "后端架构设计", count: 8, private: true, updated: "1周前", cover: "bg-purple-500" },
  { id: 3, name: "待阅读清单", count: 24, private: true, updated: "5小时前", cover: "bg-orange-500" },
  { id: 4, name: "UI/UX 灵感库", count: 15, private: false, updated: "3天前", cover: "bg-pink-500" },
];

export default function CollectionsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "public" | "private">("all");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">我的收藏</h1>
           <p className="text-slate-500">管理你的知识库和阅读清单</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all">
           <Plus className="w-5 h-5" /> 新建收藏夹
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-all",
              activeTab === "all"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
            )}
          >
            全部
          </button>
          <button
            onClick={() => setActiveTab("public")}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-all",
              activeTab === "public"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
            )}
          >
            公开
          </button>
          <button
            onClick={() => setActiveTab("private")}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-all",
              activeTab === "private"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
            )}
          >
            私密
          </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {COLLECTIONS.filter(c => activeTab === "all" || (activeTab === "private" ? c.private : !c.private)).map(collection => (
            <div key={collection.id} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden">
               {/* Cover */}
               <div className={`h-24 ${collection.cover} relative`}>
                  <div className="absolute top-3 right-3">
                     {collection.private ? (
                        <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/80">
                           <Lock className="w-4 h-4" />
                        </div>
                     ) : (
                        <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/80">
                           <Globe className="w-4 h-4" />
                        </div>
                     )}
                  </div>
               </div>
               
               {/* Content */}
               <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                     <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border-2 border-white dark:border-slate-800 shadow-sm -mt-10 flex items-center justify-center text-slate-400">
                        <Folder className="w-6 h-6 fill-blue-100 text-blue-500 dark:fill-blue-900/20" />
                     </div>
                     <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <MoreVertical className="w-5 h-5" />
                     </button>
                  </div>
                  
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                     {collection.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                     {collection.count} 篇文章 · 更新于 {collection.updated}
                  </p>
                  
                  <div className="flex -space-x-2 overflow-hidden">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 ring-2 ring-white dark:ring-slate-900"></div>
                     ))}
                  </div>
               </div>
            </div>
         ))}
         
         {/* Add New Card */}
         <button className="flex flex-col items-center justify-center h-full min-h-[240px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all gap-4 group">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
               <Plus className="w-6 h-6" />
            </div>
            <span className="font-medium text-slate-500 group-hover:text-blue-600 transition-colors">创建新收藏夹</span>
         </button>
      </div>

    </div>
  );
}
