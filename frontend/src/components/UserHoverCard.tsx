"use client";

import { 
  Trophy, Star, Calendar, 
  PenTool, FileText, BookMarked, Users, 
  History, GraduationCap, Crown, Settings,
  LogOut, Sun, Moon,
  Bell, Check
} from "lucide-react";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function UserHoverCard() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user, logout } = useAuth();

  const QUICK_ACTIONS = [
    { icon: PenTool, label: "发布文章", href: "/publish", highlight: true },
    { icon: FileText, label: "草稿箱", href: "/drafts", badge: 3 },
    { icon: BookMarked, label: "收藏夹", href: "/dashboard/collections", badge: 12 },
    { icon: Users, label: "关注列表", href: "/dashboard/following" },
    { icon: History, label: "历史记录", href: "/dashboard/history" },
    { icon: GraduationCap, label: "课程中心", href: "/courses" },
    { icon: Crown, label: "会员中心", href: "/member" },
    { icon: Settings, label: "设置反馈", href: "/dashboard/settings" },
  ];

  const NOTIFICATIONS = [
    { id: 1, user: "张三", action: "点赞了你的文章", target: "《React性能优化实战》", time: "2分钟前", unread: true },
    { id: 2, user: "李四", action: "回复了你的评论", target: '"这个方法确实有效！"', time: "1小时前", unread: true },
    { id: 3, user: "系统", action: "Bug挑战赛开始报名", target: "点击参与赢取积分", time: "今天 09:00", unread: true },
  ];

  return (
    <HoverCard openDelay={300} closeDelay={500}>
      <HoverCardTrigger asChild>
        <Link href="/dashboard" className="ml-2 w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] cursor-pointer hover:scale-105 transition-transform block">
          <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
            <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="User" className="w-full h-full object-cover" />
          </div>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-[360px] p-0 overflow-hidden border-slate-200 dark:border-slate-800 shadow-xl" 
        align="end"
        sideOffset={12}
      >
        {/* A. User Info Header */}
        <div className="p-5 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10">
          <div className="flex gap-4">
            <div className="relative shrink-0">
               <div className="w-[84px] h-[84px] rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-500">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 overflow-hidden">
                    <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="User" className="w-full h-full object-cover" />
                  </div>
               </div>
               <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm border border-white dark:border-slate-800 whitespace-nowrap">
                 {user?.isPro ? "PRO会员" : "普通用户"}
               </div>
            </div>
            
            <div className="flex-1 min-w-0 space-y-2">
               <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{user?.name || "User"}</h3>
                  <p className="text-sm text-slate-500 truncate">{user?.email || "@username"}</p>
               </div>
               
               <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                     <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-yellow-500" /> Lv.{user?.level || 1}</span>
                     <span>2,480 / 5,000</span>
                  </div>
                  <Progress value={50} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
               </div>

               <div className="flex items-center gap-3 text-xs mt-2">
                  <span className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full">
                     <Star className="w-3 h-3" /> 2,480 积分
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                     <Calendar className="w-3 h-3" /> 签到: 7天
                  </span>
               </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* B. Quick Actions Grid */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-50/50 dark:bg-slate-900/50">
           {QUICK_ACTIONS.map((action, i) => {
             const Icon = action.icon;
             return (
               <Link 
                 key={i}
                 href={action.href}
                 className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group relative"
               >
                 <div className={cn(
                   "p-2 rounded-full transition-all group-hover:scale-110",
                   action.highlight ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-white text-slate-500 dark:bg-slate-800 dark:text-slate-400 shadow-sm"
                 )}>
                    {action.highlight ? <Icon className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                 </div>
                 <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{action.label}</span>
                 {action.badge && (
                    <span className="absolute top-1 right-2 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border border-white dark:border-slate-900">
                      {action.badge}
                    </span>
                 )}
               </Link>
             )
           })}
        </div>

        <Separator />

        {/* C. Notifications Preview */}
        <div className="p-4">
           <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                 <Bell className="w-3 h-3" /> 通知 (3)
              </h4>
              <Link href="/dashboard/notifications" className="text-xs text-blue-600 hover:text-blue-700 hover:underline">
                 全部已读
              </Link>
           </div>
           <div className="space-y-3">
              {NOTIFICATIONS.map(note => (
                 <div key={note.id} className="flex gap-3 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-2 p-2 rounded-lg transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                    <div className="flex-1 min-w-0">
                       <p className="text-xs text-slate-900 dark:text-slate-200 line-clamp-2">
                          <span className="font-bold">{note.user}</span> {note.action} <span className="text-slate-500">{note.target}</span>
                       </p>
                       <p className="text-[10px] text-slate-400 mt-1">{note.time}</p>
                    </div>
                 </div>
              ))}
           </div>
           <Button variant="ghost" className="w-full mt-2 h-8 text-xs text-slate-500">
             查看全部通知 →
           </Button>
        </div>

        <Separator />

        {/* E. Bottom Actions */}
        <div className="p-2 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
           <Button 
             variant="ghost" 
             size="sm" 
             className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
             onClick={() => setTheme(theme === "light" ? "dark" : "light")}
           >
             {theme === "light" ? <Moon className="w-3.5 h-3.5 mr-2" /> : <Sun className="w-3.5 h-3.5 mr-2" />}
             切换主题
           </Button>
           
           <Button 
             variant="ghost" 
             size="sm" 
             className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
             onClick={logout}
           >
             <LogOut className="w-3.5 h-3.5 mr-2" />
             退出登录
           </Button>
        </div>

      </HoverCardContent>
    </HoverCard>
  );
}
