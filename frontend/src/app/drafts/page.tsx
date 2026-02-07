"use client";

import { FileText, Clock, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DRAFTS = [
  { id: 1, title: "React 源码深度解析（二）：Fiber 架构", lastEdited: "10分钟前", wordCount: 3240, progress: 65 },
  { id: 2, title: "微前端实战：qiankun 与 module federation", lastEdited: "2小时前", wordCount: 1580, progress: 30 },
  { id: 3, title: "未命名草稿 2024-03-25", lastEdited: "昨天 18:20", wordCount: 120, progress: 5 },
  { id: 4, title: "Rust 学习笔记：所有权与借用", lastEdited: "3天前", wordCount: 5600, progress: 90 },
];

export default function DraftsPage() {
  return (
    <main className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      <div className="space-y-8">
        <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">草稿箱</h1>
        <p className="text-slate-500">这里保存了你未发布的灵感</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DRAFTS.map((draft) => (
          <div key={draft.id} className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
             <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-xl">
                   <FileText className="w-6 h-6" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                       <Edit className="w-4 h-4" /> 重命名
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 gap-2">
                       <Trash2 className="w-4 h-4" /> 删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
             </div>

             <Link href="/publish" className="flex-1 block group-hover:text-blue-600 transition-colors">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                   {draft.title}
                </h3>
             </Link>

             <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                   <Clock className="w-3 h-3" /> {draft.lastEdited}
                </div>
                <span>{draft.wordCount} 字</span>
             </div>
             
             {/* Progress Bar */}
             <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${draft.progress}%` }}
                ></div>
             </div>
          </div>
        ))}
        
        {/* Create New Draft Card */}
        <Link href="/publish" className="flex flex-col items-center justify-center h-full min-h-[200px] rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all gap-4 group">
           <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
              <Edit className="w-6 h-6" />
           </div>
           <span className="font-medium text-slate-500 group-hover:text-blue-600 transition-colors">新建草稿</span>
        </Link>
      </div>
      </div>
    </main>
  );
}
