import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Topic } from '@/lib/lobby/types';
import { getLobbyArticlesByTopic, getAllLobbyTopics } from '@/lib/lobby/repository';
import { ArrowLeft, ArrowRight, Clock, Layers, Sparkles } from 'lucide-react';

interface TemplateLobbyTopicProps {
  topic: Topic;
}

export function TemplateLobbyTopic({ topic }: TemplateLobbyTopicProps) {
  const articles = getLobbyArticlesByTopic(topic.slug);
  const otherTopics = getAllLobbyTopics().filter((t) => t.slug !== topic.slug);

  return (
    <div className="flex min-h-screen flex-col bg-white text-brand-graphite">
      <Header solid={true} />

      <main id="main" className="flex-1">
        {/* Header */}
        <header className="py-12 sm:py-16 bg-brand-void text-white border-b border-brand-edge-dark">
          <div className="container-custom space-y-4">
            <Link
              href="/lobby/archive"
              className="inline-flex items-center gap-1.5 text-xs text-brand-mist/70 hover:text-white font-light transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Lobby Archive</span>
            </Link>

            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-brand-electric" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-electric-bright">
                Topic Intelligence Index
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white tracking-tight">
              #{topic.name}
            </h1>

            <p className="text-sm sm:text-base font-light text-brand-mist/80 max-w-2xl leading-relaxed">
              {topic.description}
            </p>
          </div>
        </header>

        {/* Content Section */}
        <section className="py-12 sm:py-16">
          <div className="container-custom">
            <div className="flex items-center justify-between border-b border-brand-edge pb-4 mb-8">
              <span className="text-xs font-mono text-brand-silver">
                {articles.length} {articles.length === 1 ? 'article' : 'articles'} in this topic
              </span>
              <Link href="/lobby" className="text-xs text-brand-electric hover:underline">
                The Lobby Homepage →
              </Link>
            </div>

            {articles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/lobby/${article.slug}`}
                    className="border border-brand-edge bg-white rounded-sm p-6 flex flex-col justify-between hover:border-brand-electric hover:-translate-y-1 hover:shadow-elevated transition-all duration-300 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-brand-electric font-medium">
                          {article.franchise.replace(/-/g, ' ')}
                        </span>
                        <span className="text-[10.5px] text-brand-silver font-light">
                          {article.publishedAt}
                        </span>
                      </div>

                      <h3 className="text-lg font-light text-brand-graphite leading-snug group-hover:text-brand-electric transition-colors">
                        {article.title}
                      </h3>

                      <p className="text-xs sm:text-[13px] font-light text-brand-slate leading-relaxed line-clamp-3">
                        {article.standfirst}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-brand-edge flex items-center justify-between text-xs">
                      <span className="text-brand-silver font-light">{article.readingTimeMinutes} min read</span>
                      <span className="inline-flex items-center gap-1 text-brand-electric font-normal group-hover:translate-x-0.5 transition-transform">
                        Read brief <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-brand-surface rounded-sm border border-brand-edge p-8">
                <p className="text-sm font-light text-brand-silver">
                  New intelligence and briefings for this topic are currently in editorial review.
                </p>
                <Link href="/lobby/archive" className="btn-primary text-xs py-2 px-4 mt-4 inline-flex">
                  Browse All Archive Articles
                </Link>
              </div>
            )}

            {/* Other Topics Navigation */}
            <div className="border-t border-brand-edge pt-12 mt-16 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-brand-silver">
                Explore Other Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {otherTopics.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/lobby/topic/${t.slug}`}
                    className="px-3 py-1.5 rounded-sm bg-brand-surface hover:bg-white text-xs font-light text-brand-slate border border-brand-edge hover:border-brand-electric transition-colors"
                  >
                    #{t.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
