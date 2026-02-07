"use client";

import * as React from "react";
import { Bell, Heart, MessageSquare, UserPlus, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "like",
    user: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content: "点赞了你的文章《React 19 新特性深度解析》",
    time: "10分钟前",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    user: "Mike Ross",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    content: "评论了你的文章：写的很好，学到了很多！",
    time: "1小时前",
    read: false,
  },
  {
    id: 3,
    type: "follow",
    user: "Emma Watson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    content: "开始关注了你",
    time: "2小时前",
    read: true,
  },
  {
    id: 4,
    type: "system",
    user: "系统通知",
    avatar: "",
    content: "恭喜！你的文章被推荐至首页",
    time: "1天前",
    read: true,
  },
];

export function NotificationPopover() {
  const [unreadCount, setUnreadCount] = React.useState(2);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <h4 className="font-semibold text-sm">通知中心</h4>
          <button 
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            onClick={() => setUnreadCount(0)}
          >
            全部已读
          </button>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-slate-100 dark:border-slate-800 bg-transparent px-4 h-10">
            <TabsTrigger 
              value="all" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-2 pb-2 pt-1.5 font-normal"
            >
              全部
            </TabsTrigger>
            <TabsTrigger 
              value="likes" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-2 pb-2 pt-1.5 font-normal"
            >
              点赞
            </TabsTrigger>
            <TabsTrigger 
              value="comments" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-2 pb-2 pt-1.5 font-normal"
            >
              评论
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[320px]">
            <TabsContent value="all" className="m-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {NOTIFICATIONS.map((item) => (
                  <div key={item.id} className={cn("p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3", !item.read && "bg-blue-50/30 dark:bg-blue-900/10")}>
                    {item.type === 'system' ? (
                       <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Bell className="w-5 h-5" />
                       </div>
                    ) : (
                       <img src={item.avatar} alt={item.user} className="w-10 h-10 rounded-full shrink-0" />
                    )}
                    
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-slate-900 dark:text-slate-100 leading-snug">
                        <span className="font-semibold">{item.user}</span> {item.content}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{item.time}</span>
                        {item.type === 'like' && <Heart className="w-3 h-3 text-red-500 fill-red-500" />}
                        {item.type === 'comment' && <MessageSquare className="w-3 h-3 text-blue-500 fill-blue-500" />}
                        {item.type === 'follow' && <UserPlus className="w-3 h-3 text-green-500 fill-green-500" />}
                      </div>
                    </div>
                    {!item.read && (
                       <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            {/* Simplify other tabs for demo */}
            <TabsContent value="likes" className="m-0 p-4 text-center text-sm text-slate-500">
               暂无更多点赞消息
            </TabsContent>
            <TabsContent value="comments" className="m-0 p-4 text-center text-sm text-slate-500">
               暂无更多评论消息
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <div className="p-2 border-t border-slate-100 dark:border-slate-800">
           <Button variant="ghost" className="w-full h-8 text-xs text-slate-500">
             查看全部通知
           </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
