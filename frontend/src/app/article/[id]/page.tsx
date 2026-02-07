import { ThumbsUp, MessageSquare, Star, Share2, MoreHorizontal } from "lucide-react";
import { RecommendSidebar } from "@/components/RecommendSidebar";
import { Comments } from "@/components/Comments";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params; // consume params to satisfy linter if needed, though we don't use id specifically for mock data

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-8">
        {/* Main Article Content */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
           {/* Header */}
           <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                React 19 新特性深度解析：Server Components 实战指南
              </h1>
              
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Author" className="w-10 h-10 rounded-full" />
                    <div>
                       <div className="font-bold text-slate-900 dark:text-white">张晓明</div>
                       <div className="text-xs text-slate-500">2025-02-06 · 阅读 12,580</div>
                    </div>
                 </div>
                 
                 <button className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
                    + 关注
                 </button>
              </div>
           </div>
           
           {/* Cover Image */}
           <div className="w-full h-64 md:h-96 bg-slate-100 rounded-xl mb-8 overflow-hidden relative group">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold opacity-90 group-hover:scale-105 transition-transform duration-700">
                 {/* Placeholder for actual image */}
                 <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">Article Cover Image</span>
              </div>
           </div>
           
           {/* Content */}
           <article className="prose prose-lg prose-slate dark:prose-invert max-w-none">
              <p className="lead">
                React 19 带来了许多令人兴奋的新特性，其中最引人注目的莫过于 Server Components。本文将深入探讨 Server Components 的工作原理，以及如何在实际项目中应用这一技术。
              </p>
              
              <h2>什么是 Server Components？</h2>
              <p>
                React Server Components (RSC) 允许开发者在服务器端渲染组件，从而减少发送到客户端的 JavaScript 代码量。这意味着更快的首屏加载速度和更好的用户体验。
              </p>
              
              <h3>核心优势</h3>
              <ul>
                <li><strong>零 Bundle Size：</strong>服务器组件的代码不会打包到客户端 bundle 中。</li>
                <li><strong>直接访问后端资源：</strong>可以直接连接数据库或文件系统，无需经过 API 层。</li>
                <li><strong>自动代码分割：</strong>Client Components 会自动按需加载。</li>
              </ul>
              
              <h2>实战演练</h2>
              <p>
                让我们通过一个简单的博客系统来演示 Server Components 的用法...
              </p>
              
              <pre>
                <code>
{`// app/page.tsx
import { db } from './db';

export default async function Page() {
  const posts = await db.query('SELECT * FROM posts');
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}`}
                </code>
              </pre>
              
              <blockquote>
                 注意：Server Components 不能使用 useState 或 useEffect 等客户端 Hooks。
              </blockquote>
              
              <h2>总结</h2>
              <p>
                 React Server Components 代表了前端开发的未来方向。虽然学习曲线略陡，但带来的性能收益是巨大的。
              </p>
           </article>
           
           {/* Footer Actions */}
           <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                 <div className="flex gap-2">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"># React</span>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"># 前端</span>
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
        
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           {/* Author Card */}
           <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Author" className="w-14 h-14 rounded-full border border-slate-100" />
                 <div>
                    <div className="font-bold text-lg text-slate-900 dark:text-white">张晓明</div>
                    <div className="text-sm text-slate-500">全栈开发工程师</div>
                 </div>
              </div>
              <div className="flex gap-4 text-center mb-6">
                 <div className="flex-1">
                    <div className="font-bold text-slate-900 dark:text-white">128</div>
                    <div className="text-xs text-slate-500">文章</div>
                 </div>
                 <div className="flex-1">
                    <div className="font-bold text-slate-900 dark:text-white">12k</div>
                    <div className="text-xs text-slate-500">阅读</div>
                 </div>
                 <div className="flex-1">
                    <div className="font-bold text-slate-900 dark:text-white">856</div>
                    <div className="text-xs text-slate-500">粉丝</div>
                 </div>
              </div>
              <div className="flex gap-3">
                 <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">关注</button>
                 <button className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">私信</button>
              </div>
           </div>
           
           <RecommendSidebar />
           
           {/* TOC Sticky */}
           <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-l-4 border-blue-600 pl-3">目录</h3>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 border-l-2 border-slate-100 dark:border-slate-800 pl-4">
                 <li className="text-blue-600 font-medium border-l-2 border-blue-600 -ml-[18px] pl-4">什么是 Server Components？</li>
                 <li className="pl-4 hover:text-blue-600 cursor-pointer transition-colors">核心优势</li>
                 <li className="pl-4 hover:text-blue-600 cursor-pointer transition-colors">实战演练</li>
                 <li className="pl-4 hover:text-blue-600 cursor-pointer transition-colors">总结</li>
              </ul>
           </div>
        </div>
      </div>
      
      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-3 px-4 md:hidden z-40 flex items-center justify-around text-slate-500">
         <button className="flex flex-col items-center gap-1 hover:text-blue-600">
            <ThumbsUp className="w-5 h-5" />
            <span className="text-xs">856</span>
         </button>
         <button className="flex flex-col items-center gap-1 hover:text-blue-600">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">45</span>
         </button>
         <button className="flex flex-col items-center gap-1 hover:text-blue-600">
            <Star className="w-5 h-5" />
            <span className="text-xs">收藏</span>
         </button>
      </div>
    </div>
  );
}
