'use client';

import { useState, useMemo } from 'react';
import { Search, ExternalLink, X } from 'lucide-react';
import { categories, totalTools, type Category } from '../../data/security-tools';

export default function ToolsBrowser() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return categories
      .filter((c) => !activeCategory || c.id === activeCategory)
      .map((c) => ({
        ...c,
        tools: c.tools.filter(
          (t) =>
            !q ||
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.tags?.some((tag) => tag.includes(q))
        ),
      }))
      .filter((c) => c.tools.length > 0);
  }, [query, activeCategory]);

  const matchCount = filtered.reduce((s, c) => s + c.tools.length, 0);

  return (
    <div className="space-y-6">
      {/* Search + Stats bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tools, tags, or descriptions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border bg-background py-2 pl-9 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="text-sm text-muted-foreground shrink-0">
          Showing{' '}
          <span className="font-semibold text-foreground">{matchCount}</span> of{' '}
          <span className="font-semibold text-foreground">{totalTools}</span> tools
          across{' '}
          <span className="font-semibold text-foreground">{categories.length}</span>{' '}
          categories
        </p>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            activeCategory === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeCategory === c.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Search className="mx-auto mb-3 h-8 w-8 opacity-30" />
          <p className="text-sm">No tools match &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filtered.map((cat) => (
            <CategorySection key={cat.id} category={cat} query={query} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategorySection({
  category,
  query,
}: {
  category: Category;
  query: string;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">{category.icon}</span>
        <div>
          <h2 className="text-base font-semibold leading-tight">
            {category.name}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {category.tools.length} tool{category.tools.length !== 1 ? 's' : ''}
            </span>
          </h2>
          <p className="text-xs text-muted-foreground">{category.description}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {category.tools.map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-lg border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold group-hover:text-primary transition-colors leading-snug">
                {highlight(tool.name, query)}
              </h3>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {highlight(tool.description, query)}
            </p>
            {tool.tags && tool.tags.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
