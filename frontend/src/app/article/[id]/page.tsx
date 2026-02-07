"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ThumbsUp, MessageSquare, Star, Share2, MoreHorizontal } from "lucide-react";
import { RecommendSidebar } from "@/components/RecommendSidebar";
import { Comments } from "@/components/Comments";
import { articleApi } from "@/api/articles";
import type { ArticleResponse } from "@/api/types";
import { useAuth } from "@/context/AuthContext";

function formatCount(n?: number) {
  const v = n || 0;
  return new Intl.NumberFormat("zh-CN").format(v);
}

export default function ArticlePage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const { checkAuth } = useAuth();
  const [article, setArticle] = useState<ArticleResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    articleApi
      .detail(id)
      .then((a) => {
        setArticle(a);
        articleApi.view(id).catch(() => {});
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading && !article) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800">
          加载中...
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800">
          文章不存在或无权访问
        </div>
      </div>
    );
  }

  const authorName = article.author.displayName || article.author.username;
  const authorAvatar = article.author.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";
  const date = (article.publishedAt || article.createdAt || "").slice(0, 10);

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                {article.title}
              </h1>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={authorAvatar} alt="Author" className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{authorName}</div>
                    <div className="text-xs text-slate-500">
                      {date} · 阅读 {formatCount(article.viewCount)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {article.coverImage ? (
              <div className="w-full h-64 md:h-96 bg-slate-100 rounded-xl mb-8 overflow-hidden relative">
                <img src={article.coverImage} alt="Cover" className="w-full h-full object-cover" />
              </div>
            ) : null}

            <article
              className="prose prose-lg prose-slate dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.htmlContent || "" }}
            />

            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {article.tags.map((t) => (
                    <span
                      key={t.id}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      # {t.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-slate-500">
                  <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">分享</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Comments />
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4 mb-4">
              <img src={authorAvatar} alt="Author" className="w-14 h-14 rounded-full border border-slate-100" />
              <div>
                <div className="font-bold text-lg text-slate-900 dark:text-white">{authorName}</div>
                <div className="text-sm text-slate-500">{article.author.bio || "作者还没有填写简介"}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
                onClick={() => {
                  checkAuth(async () => {
                    const updated = await articleApi.like(article.id);
                    setArticle(updated);
                  });
                }}
              >
                {article.liked ? "已点赞" : "点赞"} · {formatCount(article.likeCount)}
              </button>
              <button
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                onClick={() => {
                  checkAuth(async () => {
                    const updated = await articleApi.collect(article.id);
                    setArticle(updated);
                  });
                }}
              >
                {article.collected ? "已收藏" : "收藏"} · {formatCount(article.collectCount)}
              </button>
            </div>
          </div>

          <RecommendSidebar />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-3 px-4 md:hidden z-40 flex items-center justify-around text-slate-500">
        <button
          className="flex flex-col items-center gap-1 hover:text-blue-600"
          onClick={() => {
            checkAuth(async () => {
              const updated = await articleApi.like(article.id);
              setArticle(updated);
            });
          }}
        >
          <ThumbsUp className="w-5 h-5" />
          <span className="text-xs">{formatCount(article.likeCount)}</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-blue-600">
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs">{formatCount(article.commentCount)}</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 hover:text-blue-600"
          onClick={() => {
            checkAuth(async () => {
              const updated = await articleApi.collect(article.id);
              setArticle(updated);
            });
          }}
        >
          <Star className="w-5 h-5" />
          <span className="text-xs">{article.collected ? "已收藏" : "收藏"}</span>
        </button>
      </div>
    </div>
  );
}
