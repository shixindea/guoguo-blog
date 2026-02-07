"use client";

import { Clock, Search, Trash2, Calendar } from "lucide-react";
import Link from "next/link";

// Mock Data
const HISTORY = [
  { 
    date: "今天",
    items: [
      { id: 1, title: "React 19 新特性深度解析", author: "张晓明", time: "10:30", progress: 85 },
      { id: 2, title: "TypeScript 高级类型实战", author: "李思远", time: "09:15", progress: 30 },
      { id: 3, title: "Next.js 14 App Router 最佳实践", author: "官方团队", time: "08:45", progress: 100 },
    ]
  },
  { 
    date: "昨天",
    items: [
      { id: 4, title: "Rust 语言基础教程", author: "Mike Ross", time: "16:20", progress: 5 },
      { id: 5, title: "2024 前端架构趋势", author: "Emma Watson", time: "14:10", progress: 60 },
    ]
  },
  { 
    date: "更早",
    items: [
      { id: 6, title: "WebAssembly 在生产环境的应用", author: "Sarah Chen", time: "3天前", progress: 100 },
    ]
  }
];

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">浏览历史</h1>
           <p className="text-slate-500">查看你的阅读足迹和进度</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="搜索历史记录..." 
                    className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-sm font-medium transition-colors">
                <Trash2 className="w-4 h-4" /> 清空
            </button>
        </div>
      </div>

      <div className="space-y-8 relative">
         {/* Vertical Line */}
         <div className="absolute left-3 top-2 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -z-10 hidden md:block"></div>

         {HISTORY.map((group, index) => (
            <div key={index} className="relative">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-950 shadow-sm z-10">
                        <Calendar className="w-3 h-3" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{group.date}</h3>
                </div>

                <div className="md:ml-9 space-y-3">
                    {group.items.map((item) => (
                        <div key={item.id} className="group bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
                            {/* Progress Ring or Icon */}
                            <div className="relative w-12 h-12 shrink-0">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <path className="text-blue-600 drop-shadow-sm" strokeDasharray={`${item.progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                    {item.progress}%
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <Link href="#" className="block">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 truncate group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h4>
                                </Link>
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <span>{item.author}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {item.time}
                                    </span>
                                </div>
                            </div>

                            <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
         ))}
      </div>
    </div>
  );
}
