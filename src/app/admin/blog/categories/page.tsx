import { Metadata } from 'next';
import { memoryStore } from '@/server/blog/store';

export const metadata: Metadata = { title: 'Categories | Blog | EntireFM Admin' };

export default function CategoriesPage() {
  const categories = memoryStore.categories;
  const posts = Array.from(memoryStore.posts.values());

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">Blog Categories</h1>
          <p className="text-sm text-zinc-400 mt-1">FM domain taxonomies and SEO hub categorization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => {
          const count = posts.filter(p => p.categoryId === cat.id).length;
          return (
            <div key={cat.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-normal text-white">{cat.name}</h3>
                  <code className="text-xs text-zinc-500">/{cat.slug}</code>
                </div>
                <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full">
                  {count} {count === 1 ? 'post' : 'posts'}
                </span>
              </div>
              <p className="text-xs text-zinc-400">{cat.description}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
