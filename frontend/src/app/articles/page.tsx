import { ArticleList } from "@/components/ArticleList";

export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">探索技术文章</h1>
        <p className="text-slate-500 text-lg">发现最新的技术趋势和开发实践</p>
      </div>
      
      {/* Tags Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-8 overflow-x-auto pb-2">
        {["全部", "JavaScript", "React", "Vue", "TypeScript", "Node.js", "Python", "Go", "Rust"].map((tag, i) => (
            <button 
                key={tag} 
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    i === 0 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
            >
                {tag}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12">
            <ArticleList />
          </div>
      </div>
    </div>
  );
}
