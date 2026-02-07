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
import { useEffect, useMemo, useState } from "react";
import { articleApi } from "@/api/articles";
import type { ArticleListItem, PageResponse } from "@/api/types";
import { useAuth } from "@/context/AuthContext";

function formatRelative(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  return date.toISOString().slice(0, 16).replace("T", " ");
}

export default function DraftsPage() {
  const { checkAuth } = useAuth();
  const [page, setPage] = useState<PageResponse<ArticleListItem> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth(() => {
      setLoading(true);
      articleApi
        .drafts({ page: 1, size: 50 })
        .then(setPage)
        .finally(() => setLoading(false));
    });
  }, [checkAuth]);

  const drafts = useMemo(() => page?.list || [], [page]);

  return (
    <main className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      <div className="space-y-8">
        <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">草稿箱</h1>
        <p className="text-slate-500">这里保存了你未发布的灵感</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && drafts.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-slate-500">
            加载中...
          </div>
        )}

        {drafts.map((draft) => (
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

             <Link href={`/publish?id=${draft.id}`} className="flex-1 block group-hover:text-blue-600 transition-colors">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                   {draft.title}
                </h3>
             </Link>

             <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                   <Clock className="w-3 h-3" /> {formatRelative(draft.createdAt)}
                </div>
                <span>{(draft.summary || "").length} 字</span>
             </div>
             
             {/* Progress Bar */}
             <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, Math.floor(((draft.summary || "").length / 200) * 100)))}%` }}
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
