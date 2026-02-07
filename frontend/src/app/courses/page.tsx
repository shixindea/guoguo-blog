"use client";

import { PlayCircle, Clock, Star, BookOpen, ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const COURSES = [
  {
    id: 1,
    title: "React 19 全栈开发实战",
    instructor: "张晓明",
    level: "进阶",
    students: 1250,
    rating: 4.9,
    progress: 35,
    cover: "bg-blue-500",
    totalTime: "12h 30m",
    chapters: 12
  },
  {
    id: 2,
    title: "Rust 系统编程入门",
    instructor: "Mike Ross",
    level: "入门",
    students: 850,
    rating: 4.8,
    progress: 0,
    cover: "bg-orange-500",
    totalTime: "8h 15m",
    chapters: 8
  },
  {
    id: 3,
    title: "WebAssembly 高性能应用",
    instructor: "Sarah Chen",
    level: "高级",
    students: 420,
    rating: 5.0,
    progress: 80,
    cover: "bg-purple-500",
    totalTime: "6h 45m",
    chapters: 6
  },
];

export default function CoursesPage() {
  return (
    <main className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">课程中心</h1>
          <p className="text-slate-500">我的学习进度与课程库</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
           <BookOpen className="w-4 h-4" /> 浏览全部课程
        </Button>
      </div>

      {/* Learning Progress */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
         <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" /> 正在学习
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course) => (
               <div key={course.id} className="group flex flex-col gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-slate-100 dark:border-slate-800">
                  {/* Cover */}
                  <div className={`aspect-video w-full rounded-lg ${course.cover} relative overflow-hidden`}>
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-blue-600 shadow-lg cursor-pointer transform hover:scale-110 transition-transform">
                           <PlayCircle className="w-6 h-6 fill-current" />
                        </div>
                     </div>
                     <Badge className="absolute top-2 right-2 bg-black/50 backdrop-blur-md border-none text-white hover:bg-black/60">
                        {course.level}
                     </Badge>
                  </div>

                  <div className="flex-1 space-y-2">
                     <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {course.title}
                     </h3>
                     <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{course.instructor}</span>
                        <span className="flex items-center gap-1 text-yellow-500">
                           <Star className="w-3 h-3 fill-current" /> {course.rating}
                        </span>
                     </div>
                     
                     <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-xs">
                           <span className="text-slate-500">已学 {course.progress}%</span>
                           <span className="text-slate-900 dark:text-slate-300 font-medium">{course.progress === 100 ? "已完成" : "继续学习"}</span>
                        </div>
                        <Progress value={course.progress} className="h-1.5" />
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Recommended */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">为你推荐</h2>
            <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
               查看更多 <ChevronRight className="w-4 h-4" />
            </Link>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
               <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                  <div className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                  <div className="p-4 space-y-3">
                     <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                     <div className="flex gap-2">
                        <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                        <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
      </div>
    </main>
  );
}
