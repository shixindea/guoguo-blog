import { Plus } from "lucide-react";

export function TagsSidebar() {
  return (
    <div className="space-y-6">
      {/* Tags */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-l-4 border-blue-600 pl-3">热门标签</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "#JavaScript", "#React", "#Vue", "#TypeScript", "#Node.js", "#Python", "#Go", "#Rust", "#Docker", "#Kubernetes", "#AI", "#微服务", "#前端工程化", "#性能优化"
          ].map((tag, i) => (
            <span key={i} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-100 dark:border-slate-700">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Hot Topics */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-l-4 border-blue-600 pl-3">本周热议</h3>
        <ul className="space-y-5">
          {[
            { title: "React 19 正式发布，你升级了吗？", comments: "1,234" },
            { title: "AI 编程助手会取代程序员吗？", comments: "2,345" },
            { title: "2025 年最值得学习的编程语言", comments: "1,876" },
            { title: "如何从初级到高级前端工程师", comments: "1,567" },
            { title: "Web3 开发者的职业前景分析", comments: "987" },
          ].map((topic, i) => (
            <li key={i} className="group cursor-pointer">
              <div className="flex gap-2 items-start">
                 <span className="text-orange-500 text-xs mt-1">🔥</span>
                 <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors leading-snug">
                    {topic.title}
                 </h4>
              </div>
              <div className="flex items-center gap-1 mt-1 pl-6">
                 <span className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    💬 {topic.comments}
                 </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
       <div className="fixed bottom-8 right-8 md:hidden z-40">
           <button className="w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-600/40 flex items-center justify-center text-white active:scale-95 transition-transform">
                <Plus className="w-8 h-8" />
           </button>
       </div>
    </div>
  );
}
