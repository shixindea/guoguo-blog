"use client";
import { ThumbsUp, MessageSquare, Eye } from "lucide-react";
import Link from "next/link";

const articles = [
  {
    id: 1,
    title: "React 19 新特性深度解析：Server Components 实战指南",
    summary: "深入探讨 React 19 中最重要的特性 Server Components，从原理到实践，帮助你快速掌握这一革命性的技术。本文将通过实际案例展示如何在生产环境中使用 Server Components。",
    author: { name: "张晓明", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
    date: "2小时前",
    views: "12,580",
    likes: 856,
    comments: 45,
    tags: ["React", "前端开发", "Server Components"]
  },
  {
    id: 2,
    title: "TypeScript 5.5 类型体操：从入门到精通",
    summary: "TypeScript 类型系统是前端开发中最强大的工具之一。本文将带你从基础类型开始，逐步深入到高级类型技巧，包括条件类型、映射类型、模板字面量类型等核心概念。",
    author: { name: "李思远", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack" },
    date: "5小时前",
    views: "9,234",
    likes: 623,
    comments: 32,
    tags: ["TypeScript", "前端开发", "类型系统"]
  },
  {
    id: 3,
    title: "GraphQL API 设计与性能优化",
    summary: "GraphQL 为 API 设计带来了革命性的变化。本文深入探讨 GraphQL 的设计原则、性能优化技巧，以及如何解决 N+1 查询等常见问题。",
    author: { name: "黄俊杰", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan" },
    date: "1天前",
    views: "8,123",
    likes: 534,
    comments: 28,
    tags: ["GraphQL", "API设计", "后端开发"]
  },
    {
    id: 4,
    title: "Rust 语言在高性能 Web 服务中的应用",
    summary: "Rust 以其内存安全和高性能著称。本文分享了我们将核心服务从 Go 迁移到 Rust 的实战经验，以及在过程中遇到的挑战和解决方案。",
    author: { name: "王伟", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nolan" },
    date: "2天前",
    views: "15,432",
    likes: 1205,
    comments: 89,
    tags: ["Rust", "后端开发", "性能优化"]
  }
];

export function ArticleList() {
  return (
    <div className="space-y-4">
        <div className="flex items-center gap-6 mb-4 bg-white dark:bg-slate-900 px-6 py-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <button className="flex items-center gap-2 text-blue-600 font-bold text-sm relative">
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-600 rounded-full"></span>
                🔥 热门推荐
            </button>
            <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 text-sm transition-colors">
                🕒 最新发布
            </button>
        </div>

      {articles.map((article) => (
        <article
          key={article.id}
          className="bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-800 group cursor-pointer hover:-translate-y-0.5 duration-300"
        >
          <Link href={`/article/${article.id}`} className="block p-6">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-1">
                    <div className="flex items-center gap-2">
                        <img src={article.author.avatar} alt={article.author.name} className="w-5 h-5 rounded-full" />
                        <span className="font-medium text-slate-900 dark:text-slate-200 hover:text-blue-600 transition-colors">{article.author.name}</span>
                    </div>
                    <span className="w-0.5 h-0.5 bg-slate-300 rounded-full"></span>
                    <span>{article.date}</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                    {article.title}
                </h3>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">
                {article.summary}
                </p>
                
                <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    {article.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-full hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-700">
                            {tag}
                        </span>
                    ))}
                </div>
                
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        <span>{article.views}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{article.likes}</span>
                    </div>
                </div>
                </div>
            </div>
          </Link>
        </article>
      ))}
      
      {/* Skeleton / Loading more */}
      <div className="py-6 flex justify-center">
        <button className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm">
            加载更多内容
        </button>
      </div>
    </div>
  );
}
