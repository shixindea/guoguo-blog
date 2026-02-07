"use client";
import Link from "next/link";
import { Search, Bell, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SearchDropdown } from "@/components/SearchDropdown";
import { NotificationPopover } from "@/components/NotificationPopover";
import { DailySignIn } from "@/components/SignIn/DailySignIn";
import { UserHoverCard } from "@/components/UserHoverCard";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, openLoginModal } = useAuth();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = e.currentTarget.value;
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };
  const menuItems = [{
    id: 1,
    title: "首页",
    href: "/"
  }, {
    id: 2,
    title: "文章",
    href: "/articles"
  }, {
    id: 3,
    title: "标签",
    href: "/tags"
  }, {
    id: 4,
    title: "排行榜",
    href: "/ranking"
  }, {
    id: 5,
    title: "挑战赛",
    href: "/challenge"
  }, {
    id: 6,
    title: "工具箱",
    href: "/tools"
  }, {
    id: 7,
    title: "友链",
    href: "/links"
  }];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-800/50"
          : "bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <span className="tracking-tight">技术内容平台</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="px-4 py-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-medium text-sm"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
             <SearchDropdown />
          </div>

          <div className="flex items-center gap-2">
            <DailySignIn />

            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300">
              <Moon className="w-5 h-5" />
            </button>
            
            {isAuthenticated ? (
              <>
                <NotificationPopover />
                <UserHoverCard />
              </>
            ) : (
              <Button onClick={openLoginModal} className="bg-blue-600 hover:bg-blue-700 text-white">
                登录 / 注册
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
