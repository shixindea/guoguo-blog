"use client";
import { useState } from "react";
import { ThumbsUp } from "lucide-react";

export function Comments() {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "李明",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      date: "2025-01-15 14:30",
      content: "写得非常详细！Server Components 确实是 React 的一个重大突破，期待在实际项目中应用。",
      likes: 45,
      replies: [
        {
           id: 2,
           author: "张晓明",
           avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
           date: "2025-01-15 15:20",
           content: "感谢支持！如果在实践中遇到问题，欢迎随时交流。",
           likes: 5
        }
      ]
    },
    {
      id: 3,
      author: "王芳",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      date: "2025-01-15 16:45",
      content: "请问 Server Components 和 SSR 有什么区别？能否详细说明一下？",
      likes: 23,
      replies: []
    },
    {
      id: 4,
      author: "陈浩",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      date: "2025-01-15 18:10",
      content: "代码示例很清晰，学到了很多。特别是缓存策略那部分，非常实用！",
      likes: 12,
      replies: []
    }
  ]);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      author: "我",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Me",
      date: "刚刚",
      content: newComment,
      likes: 0,
      replies: []
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 mt-8" id="comments">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        评论 <span className="text-slate-400 text-lg font-normal">({comments.length})</span>
      </h3>
      
      {/* Input */}
      <div className="mb-8">
        <div className="relative">
            <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的评论..."
            className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-32 text-slate-900 dark:text-white transition-all"
            />
            <div className="absolute bottom-3 right-3">
                 {/* Optional: Char count or similar */}
            </div>
        </div>
        <div className="flex justify-end mt-3">
            <button 
                onClick={handleSubmit}
                disabled={!newComment.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                发表评论
            </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-8">
        {comments.map(comment => (
            <div key={comment.id} className="flex gap-4">
                <img src={comment.avatar} alt={comment.author} className="w-10 h-10 rounded-full flex-shrink-0 border border-slate-100" />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 dark:text-white">{comment.author}</span>
                        <span className="text-xs text-slate-500">{comment.date}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mb-3 leading-relaxed text-sm md:text-base">{comment.content}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors group">
                            <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>{comment.likes}</span>
                        </button>
                        <button className="hover:text-blue-600 transition-colors">回复</button>
                    </div>

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-4">
                            {comment.replies.map(reply => (
                                <div key={reply.id} className="flex gap-3">
                                    <img src={reply.avatar} alt={reply.author} className="w-8 h-8 rounded-full flex-shrink-0 border border-slate-100" />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">{reply.author}</span>
                                            <span className="text-xs text-slate-500">{reply.date}</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">{reply.content}</p>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                                <ThumbsUp className="w-3 h-3" />
                                                <span>{reply.likes}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
