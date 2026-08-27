"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import type { DocSection } from "@/types/content";
import { getIcon } from "@/lib/icons";
import { Badge, Card, Input } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DocIndexEntry {
  slug: string;
  title: string;
  description: string;
  section: string;
  sectionTitle: string;
  readTime: number;
  keywords: string[];
  /** Lowercased haystack, prepared on the server. */
  searchText: string;
}

export function DocsSearch({ entries, sections }: { entries: DocIndexEntry[]; sections: DocSection[] }) {
  const [query, setQuery] = React.useState("");
  const [section, setSection] = React.useState<string>("all");

  const results = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (section !== "all" && entry.section !== section) return false;
      if (!needle) return true;
      return entry.searchText.includes(needle);
    });
  }, [entries, query, section]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, DocIndexEntry[]>();
    for (const entry of results) {
      const list = map.get(entry.section) ?? [];
      list.push(entry);
      map.set(entry.section, list);
    }
    return map;
  }, [results]);

  return (
    <div>
      <div className="mx-auto max-w-2xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--muted-foreground)]" aria-hidden />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the documentation…"
            aria-label="Search documentation"
            className="h-14 pl-12 pr-12 text-base shadow-[var(--shadow-soft)]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <X className="size-5" aria-hidden />
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setSection("all")}
            aria-pressed={section === "all"}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              section === "all"
                ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
            )}
          >
            All
          </button>
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              aria-pressed={section === s.id}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                section === s.id
                  ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
              )}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {results.length ? (
        <div className="mt-14 space-y-12">
          {sections
            .filter((s) => grouped.has(s.id))
            .map((s) => {
              const Icon = getIcon(s.icon);
              const items = grouped.get(s.id)!;
              return (
                <section key={s.id}>
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold">{s.title}</h2>
                      <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">{s.description}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((entry) => (
                      <Card key={entry.slug} interactive className="group relative p-5">
                        <h3 className="font-semibold">
                          <Link href={`/docs/${entry.slug}`} className="after:absolute after:inset-0">
                            {entry.title}
                          </Link>
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                          {entry.description}
                        </p>
                        <p className="mt-4 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                          <Badge tone="neutral">{entry.readTime} min read</Badge>
                          <ArrowRight className="ml-auto size-4 text-[var(--primary)] transition-transform group-hover:translate-x-1" aria-hidden />
                        </p>
                      </Card>
                    ))}
                  </div>
                </section>
              );
            })}
        </div>
      ) : (
        <div className="mx-auto mt-14 max-w-lg rounded-[var(--radius-card)] border border-dashed border-[var(--border-strong)] p-12 text-center">
          <p className="text-lg font-medium">Nothing matched “{query}”</p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Try a different term, or open a support ticket and we will both answer you and write the missing article.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="secondary" onClick={() => { setQuery(""); setSection("all"); }}>
              Clear search
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
