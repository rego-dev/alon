"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { ProductScreenshot } from "@/types";
import { ScreenshotMock } from "./screenshot-mock";
import { cn } from "@/lib/utils";

export function ScreenshotGallery({
  shots,
  seed,
  productName,
}: {
  shots: ProductScreenshot[];
  seed: string;
  productName: string;
}) {
  const [index, setIndex] = React.useState(0);
  const active = shots[index];

  const go = (delta: number) => setIndex((i) => (i + delta + shots.length) % shots.length);

  return (
    <div>
      <div className="relative">
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-gradient-to-br from-[var(--primary-soft)] to-[var(--accent-soft)] p-4 sm:p-8">
          <ScreenshotMock shot={active} seed={`${seed}:${index}`} />
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous screenshot"
          className="absolute left-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)]/90 shadow-[var(--shadow-raised)] backdrop-blur transition-colors hover:text-[var(--primary)] sm:-left-5"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next screenshot"
          className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)]/90 shadow-[var(--shadow-raised)] backdrop-blur transition-colors hover:text-[var(--primary)] sm:-right-5"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <p className="font-medium">{active.title}</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{active.caption}</p>
        </div>
        <p className="shrink-0 pt-0.5 text-sm text-[var(--muted-foreground)]" aria-live="polite">
          {index + 1} / {shots.length}
        </p>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={`${productName} screenshots`}>
        {shots.map((shot, i) => (
          <button
            key={shot.title}
            role="tab"
            aria-selected={i === index}
            aria-label={shot.title}
            onClick={() => setIndex(i)}
            className={cn(
              "shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
              i === index
                ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--border-strong)]",
            )}
          >
            {shot.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export function VideoDemo({ productName, duration }: { productName: string; duration: string }) {
  const [playing, setPlaying] = React.useState(false);

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--foreground)]/[0.03]">
      <div className="aspect-video w-full bg-gradient-to-br from-[var(--primary)]/20 via-[var(--surface)] to-[var(--accent)]/20">
        <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
          {playing ? (
            <>
              <div className="flex items-center gap-3">
                <span className="size-2.5 animate-pulse rounded-full bg-[var(--danger)]" />
                <p className="text-sm font-medium">Streaming the {productName} product tour</p>
              </div>
              <p className="max-w-sm text-xs text-[var(--muted-foreground)]">
                The demo player is wired to the media CDN in production. In this build the source is a placeholder so
                the page ships without a video payload.
              </p>
              <button
                type="button"
                onClick={() => setPlaying(false)}
                className="text-xs font-medium text-[var(--primary)] hover:underline"
              >
                Stop
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Play the ${productName} demo, ${duration}`}
                className="group grid size-16 place-items-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-float)] transition-transform hover:scale-105"
              >
                <Play className="size-6 fill-current" aria-hidden />
              </button>
              <div>
                <p className="text-sm font-medium">{productName} product tour</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{duration} · captions available</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
