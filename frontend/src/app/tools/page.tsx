"use client";

import { Wrench, Code, FileJson, Database, Activity, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const TOOLS = [
  {
    category: "编码转换",
    items: [
      { name: "JSON 格式化", desc: "在线 JSON 校验、格式化、压缩", icon: FileJson, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
      { name: "Base64 转换", desc: "Base64 编码/解码工具", icon: Code, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
      { name: "URL 编解码", desc: "URL Encode/Decode", icon: Wrench, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    ]
  },
  {
    category: "数据生成",
    items: [
      { name: "Mock 数据生成", desc: "随机生成 JSON 模拟数据", icon: Database, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
      { name: "SQL 生成器", desc: "可视化的 SQL 语句构建工具", icon: Database, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
    ]
  },
  {
    category: "测试工具",
    items: [
      { name: "正则测试", desc: "正则表达式在线调试与测试", icon: Code, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20" },
      { name: "API 调试", desc: "轻量级 REST API 测试工具", icon: Activity, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
    ]
  }
];

export default function ToolsPage() {
  return (
    <main className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          开发者工具箱
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          精心收集的在线开发辅助工具，提升你的工作效率
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        {TOOLS.map((category) => (
          <div key={category.category}>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 pl-4 border-l-4 border-blue-600">
              {category.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.name}
                    href="#"
                    className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                       <div className={cn("p-3 rounded-xl", tool.bg, tool.color)}>
                          <Icon className="w-6 h-6" />
                       </div>
                       <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                      {tool.desc}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
