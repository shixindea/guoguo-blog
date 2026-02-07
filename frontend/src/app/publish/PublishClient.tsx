"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Eye, Send, Image as ImageIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { articleApi } from "@/api/articles";
import type { ArticleVisibility } from "@/api/types";

export default function PublishClient() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [visibility, setVisibility] = useState<ArticleVisibility>("PUBLIC");
  const { checkAuth } = useAuth();
  const [publishOpen, setPublishOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = useMemo(() => {
    const id = searchParams.get("id");
    return id ? Number(id) : null;
  }, [searchParams]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!articleId) return;
    checkAuth(() => {
      setLoading(true);
      articleApi
        .detail(articleId)
        .then((a) => {
          setTitle(a.title);
          setContent(a.content);
          setSummary(a.summary || "");
          setVisibility(a.visibility);
        })
        .finally(() => setLoading(false));
    });
  }, [articleId, checkAuth]);

  const saveDraft = () => {
    checkAuth(async () => {
      const payload = {
        title,
        content,
        summary: summary || undefined,
        status: "DRAFT" as const,
        visibility,
      };
      setLoading(true);
      try {
        const res = articleId ? await articleApi.update(articleId, payload) : await articleApi.create(payload);
        router.replace(`/publish?id=${res.id}`);
      } finally {
        setLoading(false);
      }
    });
  };

  const publish = () => {
    checkAuth(async () => {
      const payload = {
        title,
        content,
        summary: summary || undefined,
        status: "PUBLISHED" as const,
        visibility,
      };
      setLoading(true);
      try {
        const res = articleId ? await articleApi.update(articleId, payload) : await articleApi.create(payload);
        router.push(`/article/${res.id}`);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pt-16">
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-16 z-40 transition-all">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
          <span className="font-medium">文章发布</span>
          <span className="text-xs text-slate-400">草稿保存于 10:30</span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2" onClick={saveDraft} disabled={loading}>
            <Save className="w-4 h-4" /> 保存草稿
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="w-4 h-4" /> 预览
          </Button>

          <Popover open={publishOpen} onOpenChange={setPublishOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="default"
                size="sm"
                type="button"
                className="gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={(e) => {
                  e.preventDefault();
                  checkAuth(() => setPublishOpen(true));
                }}
              >
                <Send className="w-4 h-4" /> 发布
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h4 className="font-medium">发布设置</h4>
                <div className="space-y-2">
                  <Label>可见性</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`flex-1 ${visibility === "PUBLIC" ? "bg-blue-50 border-blue-200 text-blue-600" : ""}`}
                      onClick={() => setVisibility("PUBLIC")}
                    >
                      公开
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`flex-1 ${visibility === "PRIVATE" ? "bg-blue-50 border-blue-200 text-blue-600" : ""}`}
                      onClick={() => setVisibility("PRIVATE")}
                    >
                      私密
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="comments">开启评论</Label>
                  <Checkbox id="comments" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="original">原创声明</Label>
                  <Checkbox id="original" defaultChecked />
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    publish();
                    setPublishOpen(false);
                  }}
                  disabled={loading}
                >
                  确认发布
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      <div className="flex-1 flex max-w-[1600px] mx-auto w-full">
        <aside className="w-80 border-r border-slate-200 dark:border-slate-800 p-6 hidden lg:block bg-white dark:bg-slate-900 h-[calc(100vh-8rem)] sticky top-32 overflow-y-auto scrollbar-hide">
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-base font-semibold">文章封面</Label>
              <div className="aspect-video bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-500 transition-all group">
                <ImageIcon className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">点击上传封面</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">分类专栏</Label>
              <Input className="h-10" placeholder="选择或新建专栏" />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">标签</Label>
              <Input className="h-10" placeholder="添加标签 (回车确认)" />
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs font-medium flex items-center gap-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                  React <span className="hover:text-red-500">×</span>
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs font-medium flex items-center gap-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                  前端 <span className="hover:text-red-500">×</span>
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">摘要</Label>
              <textarea
                className="w-full h-32 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-shadow"
                placeholder="如果不填写，将自动抓取正文前 100 字..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              ></textarea>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-h-[calc(100vh-8rem)]">
          <div className="p-8 lg:p-12 max-w-4xl mx-auto w-full h-full flex flex-col bg-white dark:bg-slate-900 shadow-sm min-h-full">
            <input
              type="text"
              placeholder="请输入文章标题..."
              className="text-4xl lg:text-5xl font-bold border-none outline-none bg-transparent placeholder:text-slate-300 dark:placeholder:text-slate-700 mb-8 leading-tight"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="flex-1 w-full resize-none border-none outline-none bg-transparent text-lg leading-loose placeholder:text-slate-300 dark:placeholder:text-slate-700 font-serif text-slate-700 dark:text-slate-300"
              placeholder="从这里开始写正文..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
        </main>
      </div>
    </div>
  );
}

