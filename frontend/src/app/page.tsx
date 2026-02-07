import { Hero } from "@/components/Hero";
import { ArticleList } from "@/components/ArticleList";
import { RecommendSidebar } from "@/components/RecommendSidebar";
import { TagsSidebar } from "@/components/TagsSidebar";

export default function Home() {
  return (
    <main className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      <Hero />
      
      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Main Content (Largest) */}
        <div className="lg:col-span-7 space-y-8">
           <ArticleList />
        </div>
        
        {/* Middle: Recommendations (Medium) */}
        <div className="lg:col-span-3 space-y-6">
           <RecommendSidebar />
        </div>
        
        {/* Right: Tags & Topics (Smallest) */}
        <div className="lg:col-span-2 space-y-6">
           <TagsSidebar />
        </div>
      </div>
    </main>
  );
}
