"use client";

import { useState } from "react";
import { Trophy, TrendingUp, User, FileText, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock Data
const AUTHORS = [
  { id: 1, name: "张晓明", bio: "资深前端架构师", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", score: 9850, articles: 45, followers: 1200 },
  { id: 2, name: "李思远", bio: "全栈开发者", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack", score: 8900, articles: 32, followers: 850 },
  { id: 3, name: "Sarah Chen", bio: "AI 研究员", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", score: 8500, articles: 28, followers: 2100 },
  { id: 4, name: "Mike Ross", bio: "Go 语言专家", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", score: 7200, articles: 56, followers: 600 },
  { id: 5, name: "Emma Watson", bio: "UI/UX 设计师", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", score: 6800, articles: 19, followers: 980 },
];

const ARTICLES = [
  { id: 1, title: "React 19 新特性深度解析", author: "张晓明", views: "12.5k", likes: 856 },
  { id: 2, title: "深入理解 Rust 所有权机制", author: "Mike Ross", views: "10.2k", likes: 720 },
  { id: 3, title: "2024 年前端技术趋势展望", author: "李思远", views: "9.8k", likes: 650 },
  { id: 4, title: "大模型应用开发实战", author: "Sarah Chen", views: "8.5k", likes: 580 },
  { id: 5, title: "高性能 CSS 动画指南", author: "Emma Watson", views: "7.2k", likes: 490 },
];

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<"authors" | "articles">("authors");

  return (
    <main className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">
            全站排行榜
          </span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          发现最优秀的创作者和最受欢迎的内容
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-8">
          <button
            onClick={() => setActiveTab("authors")}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
              activeTab === "authors"
                ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            <User className="w-4 h-4" />
            活跃作者榜
          </button>
          <button
            onClick={() => setActiveTab("articles")}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
              activeTab === "articles"
                ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            <FileText className="w-4 h-4" />
            热门文章榜
          </button>
        </div>

        {/* List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {activeTab === "authors" ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {AUTHORS.map((author, index) => (
                <div key={author.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm",
                    index === 0 ? "bg-yellow-100 text-yellow-600" :
                    index === 1 ? "bg-slate-200 text-slate-600" :
                    index === 2 ? "bg-orange-100 text-orange-600" :
                    "text-slate-400"
                  )}>
                    {index + 1}
                  </div>
                  
                  <img src={author.avatar} alt={author.name} className="w-12 h-12 rounded-full" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate">{author.name}</h3>
                      {index < 3 && <Medal className={cn("w-4 h-4", index === 0 ? "text-yellow-500" : index === 1 ? "text-slate-400" : "text-orange-500")} />}
                    </div>
                    <p className="text-sm text-slate-500 truncate">{author.bio}</p>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-blue-600">{author.score}</div>
                    <div className="text-xs text-slate-400">影响力</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {ARTICLES.map((article, index) => (
                <div key={article.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                  <div className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shrink-0",
                    index < 3 ? "text-red-500" : "text-slate-400"
                  )}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">{article.title}</h3>
                    <p className="text-sm text-slate-500">
                      作者: {article.author}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-500">
                     <div className="flex items-center gap-1">
                       <TrendingUp className="w-4 h-4 text-red-500" />
                       <span>{article.views}</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
