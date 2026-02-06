"use client";

import { useState } from "react";
import { Calendar, Gift, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const SIGN_IN_DAYS = [
  { day: 1, reward: 10, signed: true },
  { day: 2, reward: 10, signed: true },
  { day: 3, reward: 20, signed: false }, // Today
  { day: 4, reward: 10, signed: false },
  { day: 5, reward: 10, signed: false },
  { day: 6, reward: 10, signed: false },
  { day: 7, reward: 50, signed: false, isBigReward: true },
];

export function DailySignIn() {
  const [signed, setSigned] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleSignIn = () => {
    setSigned(true);
    setShowAnimation(true);
    // In a real app, call API here
    setTimeout(() => setShowAnimation(false), 3000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 hidden md:flex">
          <Calendar className="w-4 h-4" /> 签到
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            每日签到
          </DialogTitle>
          <DialogDescription>
            连续签到 7 天可获得额外大奖！
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
           {/* Progress */}
           <div className="mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                 <span className="text-slate-500">已连续签到 2 天</span>
                 <span className="text-slate-900 font-medium">2/7</span>
              </div>
              <Progress value={28} className="h-2" />
           </div>

           {/* Grid */}
           <div className="grid grid-cols-4 gap-3 mb-6">
              {SIGN_IN_DAYS.map((item, index) => (
                 <div 
                   key={item.day}
                   className={cn(
                     "flex flex-col items-center justify-center p-2 rounded-lg border text-sm relative overflow-hidden",
                     item.signed ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800" : 
                     (index === 2 && !signed) ? "border-blue-500 ring-1 ring-blue-500" :
                     "border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900"
                   )}
                 >
                    {item.signed && (
                       <div className="absolute top-1 right-1">
                          <CheckCircle2 className="w-3 h-3" />
                       </div>
                    )}
                    <span className="text-xs mb-1">第{item.day}天</span>
                    {item.isBigReward ? (
                       <Gift className={cn("w-5 h-5 mb-1", item.signed ? "text-blue-500" : "text-orange-500")} />
                    ) : (
                       <span className="font-bold text-lg">+{item.reward}</span>
                    )}
                 </div>
              ))}
           </div>

           <Button 
             className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
             onClick={handleSignIn}
             disabled={signed}
           >
             {signed ? "今日已签到" : "立即签到领取 20 积分"}
           </Button>
        </div>
        
        {/* Simple Animation Overlay */}
        {showAnimation && (
           <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-50 rounded-lg flex-col animate-in fade-in zoom-in duration-300">
              <Gift className="w-16 h-16 text-orange-500 mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-orange-500">签到成功!</h3>
              <p className="text-slate-600 dark:text-slate-300 font-medium">+20 积分</p>
           </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
