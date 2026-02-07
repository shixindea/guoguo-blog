"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Filter, Calendar, ChevronDown, User, Hash, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArticleList } from "@/components/ArticleList";
import Link from "next/link";

// Mock Data for other tabs
const USERS = [
  { id: 1, name: "张晓明", bio: "资深前端架构师", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", followers: 1200 },
  { id: 2, name: "李思远", bio: "全栈开发者，Rust 爱好者", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack", followers: 850 },
];

const TAGS = [
  { id: 1, name: "React", count: 1250 },
  { id: 3, name: "Next.js", count: 850 },
];

const TABS = [
  { id: "all", label: "综合" },
  { id: "article", label: "文章" },
  { id: "user", label: "用户" },
  { id: "tag", label: "标签" },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <main className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      
      {/* Search Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="relative mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索感兴趣的内容..."
            className="w-full px-6 py-4 pl-14 bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-blue-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-lg"
          />
          <Search className="w-6 h-6 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
            搜索
          </button>
        </form>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters (Only for Article/All) */}
        {(activeTab === "all" || activeTab === "article") && (
          <div className="flex items-center gap-4 mb-8 text-sm">
            <div className="flex items-center gap-2 text-slate-500">
               <Filter className="w-4 h-4" />
               <span>筛选:</span>
            </div>
            <button className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center gap-2 hover:border-blue-500 transition-colors">
               <span>时间: 不限</span>
               <ChevronDown className="w-3 h-3" />
            </button>
            <button className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center gap-2 hover:border-blue-500 transition-colors">
               <span>排序: 相关度</span>
               <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Results */}
        {query ? (
           <div className="space-y-8">
              
              {/* Users Result (Show in All or User tab) */}
              {(activeTab === "all" || activeTab === "user") && (
                <div className="space-y-4">
                   {(activeTab === "all") && <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><User className="w-4 h-4" /> 相关用户</h3>}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {USERS.map(user => (
                        <div key={user.id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                           <img src={user.avatar} className="w-12 h-12 rounded-full" alt={user.name} />
                           <div>
                              <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                              <div className="text-xs text-slate-500">{user.bio}</div>
                           </div>
                           <button className="ml-auto px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors">
                             关注
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* Tags Result */}
              {(activeTab === "all" || activeTab === "tag") && (
                 <div className="space-y-4">
                    {(activeTab === "all") && <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Hash className="w-4 h-4" /> 相关标签</h3>}
                    <div className="flex flex-wrap gap-3">
                       {TAGS.map(tag => (
                          <Link key={tag.id} href={`/tag/${tag.id}`} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center gap-2 hover:border-blue-500 transition-colors">
                             <span className="font-medium">{tag.name}</span>
                             <span className="text-xs text-slate-400">{tag.count} 文章</span>
                          </Link>
                       ))}
                    </div>
                 </div>
              )}

              {/* Articles Result */}
              {(activeTab === "all" || activeTab === "article") && (
                 <div className="space-y-4">
                    {(activeTab === "all") && <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><FileText className="w-4 h-4" /> 相关文章</h3>}
                    <ArticleList showFilter={false} />
                 </div>
              )}

           </div>
        ) : (
          /* Empty State / Search History */
          <div className="text-center py-20">
             <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-400" />
             </div>
             <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">搜索你感兴趣的内容</h2>
             <p className="text-slate-500 dark:text-slate-400 mb-8">
               输入关键词，探索海量技术文章、作者和标签
             </p>
             
             {/* Hot Search */}
             <div className="max-w-lg mx-auto">
                <div className="text-left text-sm font-medium text-slate-500 mb-4">热门搜索</div>
                <div className="flex flex-wrap gap-2">
                   {["React 19", "Vue 3", "AI", "Rust", "面试题", "架构"].map(item => (
                      <button key={item} onClick={() => { setQuery(item); router.push(`/search?q=${item}`); }} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                         {item}
                      </button>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </main>
  );
}
