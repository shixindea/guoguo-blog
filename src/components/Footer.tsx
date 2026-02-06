import Link from "next/link";
import { Github, Twitter, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-xl text-white mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <span className="tracking-tight">技术内容平台</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 mb-6">
              为开发者提供高质量技术文章与社区互动，打造沉浸式的阅读与交流体验。连接技术与未来，探索编程的无限可能。
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">平台</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">关于我们</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">加入我们</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">联系方式</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">用户协议</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">资源</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">技术文档</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">API 接口</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">开发指南</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">常见问题</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">社区</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">创作者中心</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">活动中心</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">排行榜</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">标签广场</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-slate-600">© 2025 技术内容平台. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all cursor-pointer">
                <Github className="w-5 h-5" />
             </div>
             <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all cursor-pointer">
                <Twitter className="w-5 h-5" />
             </div>
             <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all cursor-pointer">
                <MessageCircle className="w-5 h-5" />
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
