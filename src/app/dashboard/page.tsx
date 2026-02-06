"use client";

import { Eye, ThumbsUp, Users, BookMarked, TrendingUp } from "lucide-react";

// Mock Data
const STATS = [
  { label: "文章总阅读", value: "45.2k", change: "+12%", icon: Eye, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { label: "获得点赞", value: "2,856", change: "+5%", icon: ThumbsUp, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  { label: "粉丝总数", value: "1,205", change: "+24%", icon: Users, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
  { label: "收藏文章", value: "328", change: "+2%", icon: BookMarked, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
];

const RECENT_ACTIVITIES = [
  { id: 1, type: "like", content: "李思远 点赞了你的文章《React 19 新特性深度解析》", time: "10分钟前" },
  { id: 2, type: "comment", content: "王伟 评论了你的文章《Rust 入门指南》", time: "1小时前" },
  { id: 3, type: "follow", content: "Sarah Chen 关注了你", time: "2小时前" },
  { id: 4, type: "system", content: "恭喜！你的文章《前端性能优化》被推荐至首页", time: "1天前" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">欢迎回来，张晓明 👋</h1>
        <p className="text-slate-500">这是你本周的数据概览</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart Placeholder */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[300px]">
           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">数据趋势</h3>
           <div className="w-full h-48 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
              Chart Placeholder (Recharts / Chart.js)
           </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">最近动态</h3>
           <div className="space-y-6">
             {RECENT_ACTIVITIES.map((activity) => (
               <div key={activity.id} className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0"></div>
                  <div>
                    <p className="text-slate-700 dark:text-slate-300 text-sm mb-1">{activity.content}</p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>

    </div>
  );
}
