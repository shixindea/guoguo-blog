"use client";

import { Globe, Link as LinkIcon, Building2, BookOpen, Handshake } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LINKS = [
  {
    category: "战略合作伙伴",
    items: [
      { name: "Vercel", desc: "Next.js 官方部署平台", logo: "https://assets.vercel.com/image/upload/v1664086188/nextjs/icon.png", url: "https://vercel.com", type: "strategic" },
      { name: "Supabase", desc: "开源 Firebase 替代品", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Supabase_Logo.png/1200px-Supabase_Logo.png", url: "https://supabase.com", type: "strategic" },
    ]
  },
  {
    category: "技术社区",
    items: [
      { name: "掘金", desc: "帮助开发者成长的社区", logo: "https://p3-passport.byteimg.com/img/user-avatar/43a4d02d6a3f5d436f41924963c97697~100x100.awebp", url: "https://juejin.cn", type: "community" },
      { name: "Dev.to", desc: "A constructive and inclusive social network for software developers", logo: "https://dev-to-uploads.s3.amazonaws.com/uploads/logos/resized_logo_UQww2soKuUsjaOGNB38o.png", url: "https://dev.to", type: "community" },
    ]
  },
  {
    category: "优质开源项目",
    items: [
      { name: "Tailwind CSS", desc: "Rapidly build modern websites without ever leaving your HTML", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg", url: "https://tailwindcss.com", type: "opensource" },
      { name: "React", desc: "The library for web and native user interfaces", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg", url: "https://react.dev", type: "opensource" },
    ]
  }
];

export default function LinksPage() {
  return (
    <main className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Handshake className="w-8 h-8 text-blue-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            友情链接与合作伙伴
          </span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">
          与优秀的技术社区、开源项目和企业携手共进，共建开放的技术生态。
        </p>
        <Button className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 gap-2">
           <LinkIcon className="w-4 h-4" /> 申请加入友链
        </Button>
      </div>

      <div className="space-y-16 max-w-6xl mx-auto">
        {LINKS.map((section) => (
           <div key={section.category}>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                 {section.category === "战略合作伙伴" && <Building2 className="w-5 h-5 text-blue-500" />}
                 {section.category === "技术社区" && <Globe className="w-5 h-5 text-green-500" />}
                 {section.category === "优质开源项目" && <BookOpen className="w-5 h-5 text-purple-500" />}
                 {section.category}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {section.items.map((link) => (
                    <Link 
                       key={link.name}
                       href={link.url}
                       target="_blank"
                       className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center text-center"
                    >
                       <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 p-3 mb-4 group-hover:scale-110 transition-transform">
                          <img src={link.logo} alt={link.name} className="w-full h-full object-contain" />
                       </div>
                       <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                          {link.name}
                       </h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                          {link.desc}
                       </p>
                       {link.type === "strategic" && (
                          <Badge variant="secondary" className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                             官方合作
                          </Badge>
                       )}
                    </Link>
                 ))}
              </div>
           </div>
        ))}
      </div>

    </main>
  );
}
