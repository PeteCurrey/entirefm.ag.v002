import { Metadata } from 'next';
import { memoryStore } from '@/server/blog/store';

export const metadata: Metadata = { title: 'Authors | Blog | EntireFM Admin' };

export default function AuthorsPage() {
  const authors = memoryStore.authors;
  const posts = Array.from(memoryStore.posts.values());

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Editorial Authors</h1>
          <p className="text-sm text-zinc-400 mt-1">FM technical authors, engineering team personas, and credentials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {authors.map(author => {
          const count = posts.filter(p => p.authorId === author.id).length;
          return (
            <div key={author.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">{author.name}</h3>
                  <div className="text-xs text-blue-400 font-medium mt-0.5">{author.role}</div>
                </div>
                <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full">
                  {count} {count === 1 ? 'post' : 'posts'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{author.bio}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
