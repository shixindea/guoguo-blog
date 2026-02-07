"use client";

import { useState } from "react";
import { UserCheck, UserPlus, MoreHorizontal, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const USERS = [
  { id: 1, name: "Sarah Chen", bio: "AI Researcher @ Google", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", isFollowing: true, followers: 1200 },
  { id: 2, name: "Mike Ross", bio: "Go Developer | Open Source Enthusiast", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", isFollowing: false, followers: 850 },
  { id: 3, name: "Emma Watson", bio: "Frontend Developer @ Airbnb", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", isFollowing: true, followers: 2100 },
  { id: 4, name: "John Doe", bio: "Full Stack Developer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John", isFollowing: false, followers: 340 },
  { id: 5, name: "Alice Smith", bio: "UI/UX Designer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", isFollowing: true, followers: 980 },
];

export default function FollowingPage() {
  const [activeTab, setActiveTab] = useState<"following" | "followers">("following");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = USERS.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">关注与粉丝</h1>
           <p className="text-slate-500">管理你的社交网络</p>
        </div>
        
        <div className="relative">
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索用户..." 
                className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-64"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("following")}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-all",
              activeTab === "following"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
            )}
          >
            我关注的 ({USERS.filter(u => u.isFollowing).length})
          </button>
          <button
            onClick={() => setActiveTab("followers")}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-all",
              activeTab === "followers"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
            )}
          >
            我的粉丝 (1,205)
          </button>
      </div>

      {/* User List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full border-2 border-slate-100 dark:border-slate-800" />
                
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">{user.name}</h3>
                    <p className="text-sm text-slate-500 truncate mb-1">{user.bio}</p>
                    <div className="text-xs text-slate-400">{user.followers} 粉丝</div>
                </div>

                <div className="flex flex-col gap-2">
                    <button 
                        className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-1",
                            user.isFollowing 
                                ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700" 
                                : "bg-blue-600 text-white hover:bg-blue-700"
                        )}
                    >
                        {user.isFollowing ? (
                            <><UserCheck className="w-3 h-3" /> 已关注</>
                        ) : (
                            <><UserPlus className="w-3 h-3" /> 关注</>
                        )}
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-end">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>
         ))}
      </div>
    </div>
  );
}
