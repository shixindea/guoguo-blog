"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/api/user";
import { notify } from "@/lib/notify";

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading, openLoginModal, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");

  const [notifyComment, setNotifyComment] = useState(true);
  const [notifyLike, setNotifyLike] = useState(true);
  const [notifyFollow, setNotifyFollow] = useState(false);

  const avatarPreview = useMemo(() => {
    return avatarUrl?.trim() || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";
  }, [avatarUrl]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) return;
    setLoading(true);
    userApi
      .me()
      .then((me) => {
        setEmail(me.email || "");
        setDisplayName(me.displayName || me.username || "");
        setAvatarUrl(me.avatarUrl || "");
        setBio(me.bio || "");
      })
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    setLoading(true);
    try {
      await userApi.updateMyProfile({
        displayName,
        avatarUrl,
        bio,
      });
      await refreshUser();
      notify("保存成功");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    setLoading(true);
    userApi
      .me()
      .then((me) => {
        setEmail(me.email || "");
        setDisplayName(me.displayName || me.username || "");
        setAvatarUrl(me.avatarUrl || "");
        setBio(me.bio || "");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">账号设置</h1>
        <p className="text-slate-500">管理你的个人资料和偏好设置</p>
      </div>

      {!authLoading && !isAuthenticated && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="font-medium text-slate-900 dark:text-white">你还未登录</div>
            <div className="text-sm text-slate-500">登录后才能修改资料并保存设置</div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={openLoginModal}>
            登录
          </Button>
        </div>
      )}

      <div className="space-y-8">
        {/* Profile Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <h2 className="text-lg font-bold mb-6">基本资料</h2>
           <div className="space-y-6">
              <div className="flex items-center gap-6">
                 <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                 </div>
                 <Button
                   variant="outline"
                   onClick={() => {
                     if (!isAuthenticated) {
                       openLoginModal();
                     }
                   }}
                 >
                   更换头像
                 </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="nickname">昵称</Label>
                    <Input
                      id="nickname"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={!isAuthenticated || loading}
                      placeholder="输入你的昵称"
                    />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input id="email" value={email} disabled />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="avatarUrl">头像URL</Label>
                    <Input
                      id="avatarUrl"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      disabled={!isAuthenticated || loading}
                      placeholder="https://..."
                    />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">个人简介</Label>
                    <Input
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      disabled={!isAuthenticated || loading}
                      placeholder="介绍一下自己"
                    />
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
                 <Switch checked={notifyComment} onCheckedChange={setNotifyComment} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                    <Label className="text-base">获得点赞</Label>
                    <p className="text-sm text-slate-500">当有人点赞你的文章时通知我</p>
                 </div>
                 <Switch checked={notifyLike} onCheckedChange={setNotifyLike} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                    <Label className="text-base">新增关注</Label>
                    <p className="text-sm text-slate-500">当有人关注你时通知我</p>
                 </div>
                 <Switch checked={notifyFollow} onCheckedChange={setNotifyFollow} />
              </div>
           </div>
        </div>
        
        <div className="flex justify-end gap-4">
           <Button variant="ghost" onClick={handleCancel} disabled={loading}>
             取消
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={loading}>
             {loading ? "保存中..." : "保存更改"}
           </Button>
        </div>

      </div>
    </div>
  );
}
