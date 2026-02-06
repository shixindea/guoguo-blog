"use client";

import { Eye, ThumbsUp, Users, BookMarked, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

// Mock Data
const CHART_DATA = [
  { date: "Mon", views: 2400, likes: 1400 },
  { date: "Tue", views: 1398, likes: 980 },
  { date: "Wed", views: 9800, likes: 3908 },
  { date: "Thu", views: 3908, likes: 2800 },
  { date: "Fri", views: 4800, likes: 1890 },
  { date: "Sat", views: 3800, likes: 2390 },
  { date: "Sun", views: 4300, likes: 3490 },
];

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
           <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorViews)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="likes" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorLikes)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
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
