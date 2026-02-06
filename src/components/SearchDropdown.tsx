"use client";

import * as React from "react";
import { Search, Clock, Trash2, Flame, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const HOT_SEARCHES = [
  { id: 1, title: "ChatGPT 应用开发", count: "15,234" },
  { id: 2, title: "Next.js 14 新特性", count: "12,890" },
  { id: 3, title: "React Server Components", count: "11,456" },
  { id: 4, title: "Tailwind CSS 实战", count: "10,234" },
  { id: 5, title: "TypeScript 5.0", count: "9,876" },
];

const SEARCH_HISTORY = [
  "React Hooks 最佳实践",
  "TypeScript 类型体操",
  "Vue3 性能优化",
  "Node.js 微服务架构",
  "Webpack 配置详解",
];

export function SearchDropdown() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  const handleSearch = (term: string) => {
    setOpen(false);
    setQuery(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      handleSearch(query);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative group w-64 lg:w-80">
          <Input
            type="text"
            placeholder="搜索文章、用户、标签..."
            className="w-full pl-10 pr-12 bg-slate-100 dark:bg-slate-800 border-transparent focus-visible:ring-blue-500/50 rounded-full transition-all h-10"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            ⌘K
          </div>
        </div>
      </PopoverAnchor>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl overflow-hidden" 
        align="start"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <ScrollArea className="h-[400px]">
          <div className="p-4">
            {/* Search History */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3 px-1">
                <h4 className="text-xs font-medium text-slate-500">搜索历史</h4>
                <button className="text-xs text-slate-400 hover:text-red-500 transition-colors">
                  清空
                </button>
              </div>
              <div className="space-y-1">
                {SEARCH_HISTORY.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(item)}
                    className="flex items-center gap-2 w-full px-2 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Hot Search */}
            <div>
              <div className="flex items-center gap-1.5 mb-3 px-1">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <h4 className="text-xs font-medium text-slate-500">热门搜索</h4>
              </div>
              <div className="space-y-1">
                {HOT_SEARCHES.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleSearch(item.title)}
                    className="flex items-center justify-between w-full px-2 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "w-4 text-center font-bold font-mono",
                        index < 3 ? "text-red-500" : "text-slate-400"
                      )}>
                        {index + 1}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 tabular-nums">
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
