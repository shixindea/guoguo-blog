"use client";

import { Crown, Check, Zap, Rocket, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const BENEFITS = [
  { icon: Star, label: "专属身份标识", desc: "尊贵会员徽章，昵称红色高亮" },
  { icon: Zap, label: "免广告体验", desc: "全站无广告干扰，纯净阅读" },
  { icon: Rocket, label: "文章发布加速", desc: "优先审核通道，发布无限制" },
  { icon: Shield, label: "专属客服", desc: "一对一专属技术支持服务" },
];

const PLANS = [
  { name: "月度会员", price: "29", period: "/月", desc: "灵活订阅，随时取消", recommended: false },
  { name: "年度会员", price: "299", period: "/年", desc: "立省 49元，超值首选", recommended: true },
  { name: "终身会员", price: "999", period: "一次性", desc: "永久权益，尊享服务", recommended: false },
];

export default function MemberPage() {
  return (
    <main className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      <div className="space-y-8">
        {/* Header Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/50">
                     <Crown className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h1 className="text-2xl font-bold">尊贵的钻石会员</h1>
                  <Badge className="bg-yellow-500 text-black hover:bg-yellow-400 border-none">Lv.6</Badge>
               </div>
               <p className="text-slate-300">有效期至：2024-12-31</p>
               
               <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                     <span className="text-slate-300">成长值 (2480/3000)</span>
                     <span className="text-yellow-400 font-medium">82%</span>
                  </div>
                  <Progress value={82} className="h-2 bg-slate-700" />
                  <p className="text-xs text-slate-400">再获得 520 成长值升级至 Lv.7</p>
               </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
               <Button className="bg-yellow-500 text-black hover:bg-yellow-400 w-full md:w-40 font-bold">
                  立即续费
               </Button>
               <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white w-full md:w-40">
                  会员权益
               </Button>
            </div>
         </div>
      </div>

      {/* Benefits Grid */}
      <div>
         <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">会员特权</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((item, i) => {
               const Icon = item.icon;
               return (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow">
                     <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                        <Icon className="w-6 h-6" />
                     </div>
                     <h3 className="font-bold text-slate-900 dark:text-white">{item.label}</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
               )
            })}
         </div>
      </div>

      <Separator />

      {/* Pricing Plans */}
      <div>
         <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">选择适合你的计划</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANS.map((plan, i) => (
               <div key={i} className={`relative bg-white dark:bg-slate-900 rounded-2xl border p-8 flex flex-col items-center ${plan.recommended ? 'border-blue-500 shadow-lg scale-105 z-10' : 'border-slate-200 dark:border-slate-800'}`}>
                  {plan.recommended && (
                     <div className="absolute -top-4 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                        超值推荐
                     </div>
                  )}
                  <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                     <span className="text-4xl font-bold text-slate-900 dark:text-white">¥{plan.price}</span>
                     <span className="text-slate-500">{plan.period}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-8">{plan.desc}</p>
                  
                  <ul className="space-y-4 mb-8 w-full">
                     {[1,2,3].map(j => (
                        <li key={j} className="flex items-center gap-3 text-sm">
                           <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                           </div>
                           <span className="text-slate-600 dark:text-slate-300">所有会员基础权益</span>
                        </li>
                     ))}
                  </ul>

                  <Button className={`w-full ${plan.recommended ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 dark:bg-slate-800 text-white'}`}>
                     立即订阅
                  </Button>
               </div>
            ))}
         </div>
      </div>
      </div>
    </main>
  );
}
