"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">账号设置</h1>
        <p className="text-slate-500">管理你的个人资料和偏好设置</p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <h2 className="text-lg font-bold mb-6">基本资料</h2>
           <div className="space-y-6">
              <div className="flex items-center gap-6">
                 <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                 </div>
                 <Button variant="outline">更换头像</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="nickname">昵称</Label>
                    <Input id="nickname" defaultValue="张晓明" />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input id="email" defaultValue="zhangxm@example.com" disabled />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">个人简介</Label>
                    <Input id="bio" defaultValue="资深前端工程师，热爱开源" />
                 </div>
              </div>
           </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <h2 className="text-lg font-bold mb-6">通知偏好</h2>
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                    <Label className="text-base">文章评论</Label>
                    <p className="text-sm text-slate-500">当有人评论你的文章时通知我</p>
                 </div>
                 <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                    <Label className="text-base">获得点赞</Label>
                    <p className="text-sm text-slate-500">当有人点赞你的文章时通知我</p>
                 </div>
                 <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                    <Label className="text-base">新增关注</Label>
                    <p className="text-sm text-slate-500">当有人关注你时通知我</p>
                 </div>
                 <Switch />
              </div>
           </div>
        </div>
        
        <div className="flex justify-end gap-4">
           <Button variant="ghost">取消</Button>
           <Button className="bg-blue-600 hover:bg-blue-700 text-white">保存更改</Button>
        </div>

      </div>
    </div>
  );
}
