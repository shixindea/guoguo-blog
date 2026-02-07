"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, TrendingUp, Hash, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const CATEGORIES = ["全部", "前端", "后端", "移动端", "人工智能", "DevOps", "数据库", "架构"];

const POPULAR_TAGS = [
  { id: 1, name: "React", count: 1250, trend: "+12%" },
  { id: 2, name: "Vue.js", count: 980, trend: "+5%" },
  { id: 3, name: "Next.js", count: 850, trend: "+25%" },
  { id: 4, name: "TypeScript", count: 2100, trend: "+8%" },
  { id: 5, name: "Node.js", count: 1500, trend: "+3%" },
  { id: 6, name: "Rust", count: 600, trend: "+45%" },
  { id: 7, name: "Go", count: 1100, trend: "+15%" },
  { id: 8, name: "Kubernetes", count: 750, trend: "+10%" },
  { id: 9, name: "Python", count: 1800, trend: "+2%" },
  { id: 10, name: "Tailwind CSS", count: 920, trend: "+18%" },
  { id: 11, name: "Docker", count: 890, trend: "+6%" },
  { id: 12, name: "Microservices", count: 450, trend: "+4%" },
];

const RISING_TAGS = [
  { id: 101, name: "Gemini", growth: "+150%" },
  { id: 102, name: "Sora", growth: "+120%" },
  { id: 103, name: "React 19", growth: "+85%" },
  { id: 104, name: "Bun", growth: "+60%" },
  { id: 105, name: "Rspack", growth: "+55%" },
];

export default function TagsPage() {
  const [activeCategory, setActiveCategory] = useState("全部");

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
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                )}
              >
                {cat}
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
              {POPULAR_TAGS.map((tag) => (
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
                      {tag.count} 文章
                    </div>
                  </div>
                  {tag.trend.includes("+") && (
                     <span className="text-xs font-medium text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">
                       {tag.trend}
                     </span>
                  )}
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
              {RISING_TAGS.map((tag, index) => (
                <div key={tag.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold",
                      index < 3 ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                    )}>
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                      {tag.name}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-orange-500">
                    <Activity className="w-3 h-3" />
                    {tag.growth}
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
              <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-medium transition-colors text-sm">
                申请创建标签
              </button>
           </div>

        </div>
      </div>
    </main>
  );
}
