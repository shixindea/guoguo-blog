"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { checkinApi } from "@/api/checkins";
import type { CheckinCalendarDTO, CheckinStatusDTO } from "@/api/types";

export function DailySignIn() {
  const [signed, setSigned] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [open, setOpen] = useState(false);
  const { checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<CheckinStatusDTO | null>(null);
  const [calendar, setCalendar] = useState<CheckinCalendarDTO | null>(null);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const handleSignIn = () => {
    checkAuth(async () => {
      setLoading(true);
      try {
        const res = await checkinApi.checkin({ method: "WEB" });
        setStatus(res.status);
        setSigned(true);
        setEarnedPoints(res.totalPoints);
        setShowAnimation(true);
        const ym = res.checkinDate.slice(0, 7);
        const cal = await checkinApi.calendar({ yearMonth: ym });
        setCalendar(cal);
        setTimeout(() => setShowAnimation(false), 2500);
      } finally {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (!open) return;
    checkAuth(async () => {
      setLoading(true);
      try {
        const s = await checkinApi.status();
        setStatus(s);
        setSigned(s.todayChecked);
        const now = new Date();
        const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const cal = await checkinApi.calendar({ yearMonth: ym });
        setCalendar(cal);
      } finally {
        setLoading(false);
      }
    });
  }, [open, checkAuth]);

  const weekItems = useMemo(() => {
    const currentStreak = status?.currentStreak || 0;
    const todayChecked = !!status?.todayChecked;
    const claimed = Math.min(currentStreak, 7);
    return Array.from({ length: 7 }).map((_, idx) => {
      const day = idx + 1;
      const signedDay = day <= claimed;
      const isToday = day === claimed + 1 && !todayChecked;
      const isBigReward = day === 7;
      const reward = isBigReward ? 50 : day === 3 ? 20 : 10;
      return { day, reward, signed: signedDay, isToday, isBigReward };
    });
  }, [status]);

  const currentStreak = status?.currentStreak || 0;
  const progress = Math.min(100, (Math.min(currentStreak, 7) / 7) * 100);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 hidden md:flex"
          onClick={(e) => {
            e.preventDefault();
            checkAuth(() => setOpen(true));
          }}
        >
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
                 <span className="text-slate-500">已连续签到 {currentStreak} 天</span>
                 <span className="text-slate-900 font-medium">{Math.min(currentStreak, 7)}/7</span>
              </div>
              <Progress value={progress} className="h-2" />
              {calendar && (
                <div className="flex justify-between text-xs text-slate-500">
                  <span>本月已签 {calendar.monthDays} 天</span>
                  <span>本月积分 {calendar.monthPoints}</span>
                </div>
              )}
           </div>

           {/* Grid */}
           <div className="grid grid-cols-4 gap-3 mb-6">
              {weekItems.map((item) => (
                 <div 
                   key={item.day}
                   className={cn(
                     "flex flex-col items-center justify-center p-2 rounded-lg border text-sm relative overflow-hidden",
                     item.signed ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800" : 
                     (item.isToday && !signed) ? "border-blue-500 ring-1 ring-blue-500" :
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
             disabled={signed || loading}
           >
             {signed ? "今日已签到" : loading ? "签到中..." : "立即签到"}
           </Button>
        </div>
        
        {/* Simple Animation Overlay */}
        {showAnimation && (
           <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-50 rounded-lg flex-col animate-in fade-in zoom-in duration-300">
              <Gift className="w-16 h-16 text-orange-500 mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-orange-500">签到成功!</h3>
              <p className="text-slate-600 dark:text-slate-300 font-medium">+{earnedPoints} 积分</p>
           </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
