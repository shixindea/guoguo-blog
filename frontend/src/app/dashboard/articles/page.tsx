"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, MoreVertical, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { articleApi } from "@/api/articles";
import type { ArticleListItem, PageResponse } from "@/api/types";

export default function ArticlesPage() {
  const router = useRouter();
  const { user, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState<PageResponse<ArticleListItem> | null>(null);
  const [loading, setLoading] = useState(false);

  const status = useMemo(() => {
    if (activeTab === "published") return "PUBLISHED";
    if (activeTab === "draft") return "DRAFT";
    return undefined;
  }, [activeTab]);

  useEffect(() => {
    checkAuth(() => {
      if (!user) return;
      setLoading(true);
      articleApi
        .list({ page: 1, size: 50, userId: user.id, status, keyword: keyword || undefined, sortBy: "createdAt", order: "desc" })
        .then(setPage)
        .finally(() => setLoading(false));
    });
  }, [checkAuth, user, status, keyword]);

  const articles = page?.list || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">内容管理</h1>
          <p className="text-slate-500">管理你的文章、草稿和发布状态</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          onClick={() => {
            checkAuth(() => router.push("/publish"));
          }}
        >
          <Plus className="w-4 h-4" /> 写文章
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
            <Input placeholder="搜索文章标题..." className="pl-9" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" /> 筛选
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 h-12">
            <TabsTrigger value="all">全部文章</TabsTrigger>
            <TabsTrigger value="published">已发布</TabsTrigger>
            <TabsTrigger value="draft">草稿箱</TabsTrigger>
            <TabsTrigger value="reviewing">审核中</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="m-0">
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading && articles.length === 0 && <div className="p-6 text-slate-500">加载中...</div>}
              {articles.map((article) => (
                <div key={article.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <FileText className="w-6 h-6 text-slate-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate">{article.title}</h3>
                      {article.status === "PUBLISHED" && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">已发布</Badge>
                      )}
                      {article.status === "DRAFT" && (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">草稿</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {(article.publishedAt || article.createdAt || "").slice(0, 10)}</span>
                      {article.status === "PUBLISHED" && (
                        <>
                          <span>{(article.viewCount || 0).toLocaleString()} 阅读</span>
                          <span>{(article.likeCount || 0).toLocaleString()} 点赞</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/publish?id=${article.id}`)}>编辑</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/article/${article.id}`)}>预览</DropdownMenuItem>
                        <DropdownMenuItem>分享</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            checkAuth(async () => {
                              await articleApi.remove(article.id);
                              if (!user) return;
                              const next = await articleApi.list({ page: 1, size: 50, userId: user.id, status, keyword: keyword || undefined });
                              setPage(next);
                            });
                          }}
                        >
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Other tabs would filter the list */}
          <TabsContent value="published" className="m-0" />
          <TabsContent value="draft" className="m-0" />
        </Tabs>
      </div>
    </div>
  );
}
