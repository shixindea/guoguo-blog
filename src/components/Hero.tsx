"use client";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "微服务架构设计完全指南",
    desc: "构建可扩展、高可用的分布式系统，掌握云原生时代的核心技能",
    color: "from-blue-600 to-indigo-700",
    tag: "技术深度"
  },
  {
    id: 2,
    title: "React 19 新特性深度解析",
    desc: "探索 Server Components、Actions 等革命性更新，重塑前端开发范式",
    color: "from-cyan-500 to-blue-600",
    tag: "前端前沿"
  },
  {
    id: 3,
    title: "AI 辅助编程的最佳实践",
    desc: "如何利用大模型提升编码效率，Prompt Engineering 实战技巧",
    color: "from-purple-600 to-pink-600",
    tag: "人工智能"
  }
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[320px] md:h-[400px] rounded-2xl overflow-hidden mb-8 group shadow-xl shadow-blue-900/5 dark:shadow-none">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className={`w-full h-full bg-gradient-to-br ${slide.color} flex flex-col justify-center px-8 md:px-16 text-white relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                {/* Floating Shapes */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 left-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative z-20 max-w-3xl animate-slide-up">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium mb-4 border border-white/10">
                {slide.tag}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
                {slide.title}
              </h2>
              <p className="text-base md:text-lg text-blue-50 mb-8 opacity-90 max-w-xl leading-relaxed">
                {slide.desc}
              </p>
              <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 group-hover:translate-x-1 duration-300 shadow-lg shadow-black/10">
                立即阅读 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === current ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
