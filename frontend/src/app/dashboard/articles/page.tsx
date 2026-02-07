"use client";

import { useState } from "react";
import { Plus, Search, Filter, MoreVertical, FileText, Clock, AlertCircle } from "lucide-react";
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

const ARTICLES = [
  { id: 1, title: "React 19 新特性深度解析", status: "published", views: 12580, likes: 856, date: "2024-03-20" },
  { id: 2, title: "TypeScript 高级类型实战", status: "published", views: 9234, likes: 623, date: "2024-03-18" },
  { id: 3, title: "Rust WebAssembly 探索", status: "draft", views: 0, likes: 0, date: "2024-03-22" },
  { id: 4, title: "2024 前端架构趋势", status: "published", views: 15432, likes: 1205, date: "2024-03-15" },
  { id: 5, title: "Next.js 14 性能优化指南", status: "reviewing", views: 0, likes: 0, date: "2024-03-23" },
];

export default function ArticlesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">内容管理</h1>
          <p className="text-slate-500">管理你的文章、草稿和发布状态</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="w-4 h-4" /> 写文章
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
            <Input placeholder="搜索文章标题..." className="pl-9" />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" /> 筛选
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 h-12">
            <TabsTrigger value="all">全部文章</TabsTrigger>
            <TabsTrigger value="published">已发布</TabsTrigger>
            <TabsTrigger value="draft">草稿箱</TabsTrigger>
            <TabsTrigger value="reviewing">审核中</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="m-0">
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {ARTICLES.map((article) => (
                <div key={article.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <FileText className="w-6 h-6 text-slate-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate">{article.title}</h3>
                      {article.status === "published" && <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">已发布</Badge>}
                      {article.status === "draft" && <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">草稿</Badge>}
                      {article.status === "reviewing" && <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">审核中</Badge>}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.date}</span>
                      {article.status === "published" && (
                        <>
                          <span>{article.views.toLocaleString()} 阅读</span>
                          <span>{article.likes.toLocaleString()} 点赞</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm">编辑</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>预览</DropdownMenuItem>
                        <DropdownMenuItem>分享</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">删除</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Other tabs would filter the list */}
          <TabsContent value="published" className="m-0 p-8 text-center text-slate-500">
            仅展示已发布文章...
          </TabsContent>
          <TabsContent value="draft" className="m-0 p-8 text-center text-slate-500">
            仅展示草稿...
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
