import { Metadata } from 'next';
import { memoryStore } from '@/server/blog/store';

export const metadata: Metadata = { title: 'Media Library | Blog | EntireFM Admin' };

export default function MediaLibraryPage() {
  const media = memoryStore.media;

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">Media Library</h1>
          <p className="text-sm text-zinc-400 mt-1">FM photographic assets, switchroom surveys, and plant room diagrams</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {media.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
            <div className="h-44 bg-zinc-800 relative flex items-center justify-center p-4">
              <span className="text-4xl text-zinc-600">🖼️</span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h4 className="text-xs font-normal text-white truncate">{item.title}</h4>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{item.altText}</p>
              </div>
              <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500 flex justify-between">
                <span>{item.sourceType}</span>
                <span>{item.licenseInfo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
