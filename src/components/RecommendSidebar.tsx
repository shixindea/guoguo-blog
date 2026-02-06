import { Plus } from "lucide-react";

export function RecommendSidebar() {
  return (
    <div className="space-y-6">
      {/* For You */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-l-4 border-blue-600 pl-3">为你推荐</h3>
        <ul className="space-y-4">
          {[
            { title: "Next.js 14 App Router 迁移指南", icon: "/next.svg" },
            { title: "Rust 入门：系统编程新选择", icon: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Rust_programming_language_black_logo.svg" },
            { title: "Tailwind CSS 实用技巧集锦", icon: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" },
            { title: "PostgreSQL 性能调优实战", icon: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" },
          ].map((item, i) => (
            <li key={i} className="group cursor-pointer flex gap-3 items-start">
              <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-2 shrink-0 border border-slate-100 dark:border-slate-700">
                  <img src={item.icon} alt="icon" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 py-0.5">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Active Authors */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-l-4 border-blue-600 pl-3">活跃作者</h3>
        <ul className="space-y-4">
          {[
            { name: "技术探索者", role: "全栈开发工程师，专注于 Web 技术", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
            { name: "代码诗人", role: "热爱分享编程技巧与最佳实践", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack" },
            { name: "架构师之路", role: "10年+经验，专注于系统架构设计", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan" },
          ].map((author, i) => (
            <li key={i} className="flex items-start justify-between group">
              <div className="flex items-center gap-3">
                <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full border border-slate-100" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 group-hover:text-blue-600 transition-colors">{author.name}</h4>
                  <p className="text-xs text-slate-500 truncate w-32">{author.role}</p>
                </div>
              </div>
              <button className="flex items-center gap-1 px-3 py-1 rounded-full border border-blue-100 text-blue-600 text-xs font-medium hover:bg-blue-50 transition-all mt-1">
                <Plus className="w-3 h-3" /> 关注
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
