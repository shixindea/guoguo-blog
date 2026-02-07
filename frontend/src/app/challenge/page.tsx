"use client";

import { useState } from "react";
import { Bug, Clock, Trophy, Users, ArrowRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const CHALLENGES = [
  {
    id: 1,
    title: "修复 React 组件内存泄漏",
    difficulty: "Medium",
    reward: 500,
    participants: 128,
    timeLeft: "4小时",
    tags: ["React", "Performance"],
    status: "active",
  },
  {
    id: 2,
    title: "优化大规模数据表格渲染性能",
    difficulty: "Hard",
    reward: 1000,
    participants: 45,
    timeLeft: "2天",
    tags: ["Frontend", "Algorithm"],
    status: "active",
  },
  {
    id: 3,
    title: "解决 Docker 容器网络互通问题",
    difficulty: "Hard",
    reward: 800,
    participants: 32,
    timeLeft: "1天",
    tags: ["DevOps", "Docker"],
    status: "active",
  },
  {
    id: 4,
    title: "实现自定义 Promise",
    difficulty: "Easy",
    reward: 200,
    participants: 350,
    timeLeft: "已结束",
    tags: ["JavaScript"],
    status: "ended",
  },
];

export default function ChallengePage() {
  return (
    <main className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Bug className="w-8 h-8 text-red-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
            BugFix 极限挑战赛
          </span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          展示你的代码调试能力，参与真实场景的 Bug 修复挑战，赢取积分和专属徽章！
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                 <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">本周挑战</h3>
           </div>
           <div className="text-3xl font-bold mb-1">3</div>
           <p className="text-blue-100 text-sm">个进行中的任务</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                 <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">参与人数</h3>
           </div>
           <div className="text-3xl font-bold mb-1">1,256</div>
           <p className="text-purple-100 text-sm">位开发者已加入</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl p-6 text-white shadow-lg">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                 <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">奖池总额</h3>
           </div>
           <div className="text-3xl font-bold mb-1">50,000</div>
           <p className="text-orange-100 text-sm">积分等待瓜分</p>
        </div>
      </div>

      <div className="space-y-6">
         <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">挑战列表</h2>
         {CHALLENGES.map((challenge) => (
            <div key={challenge.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-md transition-all group">
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                     <Badge variant={challenge.difficulty === "Easy" ? "secondary" : challenge.difficulty === "Medium" ? "default" : "destructive"}>
                        {challenge.difficulty}
                     </Badge>
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {challenge.title}
                     </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                     <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-orange-500" /> {challenge.reward} 积分
                     </span>
                     <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> {challenge.participants} 人参与
                     </span>
                     {challenge.status === "active" && (
                        <span className="flex items-center gap-1 text-red-500">
                           <Clock className="w-4 h-4" /> 剩余 {challenge.timeLeft}
                        </span>
                     )}
                  </div>
               </div>

               <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="hidden md:flex flex-col items-end gap-1">
                     <div className="flex gap-1">
                        {challenge.tags.map(tag => (
                           <span key={tag} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
                              {tag}
                           </span>
                        ))}
                     </div>
                  </div>
                  <Button 
                     className={cn(
                        "w-full md:w-auto",
                        challenge.status === "active" ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-100 text-slate-400 hover:bg-slate-100 dark:bg-slate-800"
                     )}
                     disabled={challenge.status !== "active"}
                  >
                     {challenge.status === "active" ? "立即挑战" : "已结束"}
                     {challenge.status === "active" && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
               </div>
            </div>
         ))}
      </div>
    </main>
  );
}
