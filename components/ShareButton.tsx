"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackGameEvent } from "@/lib/analytics";
import { roleShortLabels } from "@/lib/game";
import { shareText } from "@/lib/result-copy";
import type { StartupResult } from "@/lib/scoring";
import { toPng } from "html-to-image";
import {
  Copy,
  Download,
  Link,
  MessageCircle,
  Send,
  Share2,
  X,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

type ShareButtonProps = {
  target: React.RefObject<HTMLElement | null>;
  result: StartupResult;
};

export function ShareButton({ target, result }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const text = useMemo(() => shareText(result), [result]);
  const shareUrl =
    typeof window === "undefined"
      ? "https://till-series-b.vercel.app/result"
      : window.location.href;

  async function downloadImage() {
    if (!target.current) return;

    const dataUrl = await toPng(target.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "oklch(0.13 0.025 250)",
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "till-series-b-result.png";
    link.click();
  }

  async function copyShare() {
    await navigator.clipboard?.writeText(text);
  }

  function openSocial(kind: "x" | "facebook" | "linkedin" | "whatsapp") {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(shareUrl);
    const urls = {
      x: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
    };

    window.open(urls[kind], "_blank", "noopener,noreferrer");
  }

  function openModal() {
    trackGameEvent("share_clicked", {
      outcome: result.tier,
      score: result.score,
    });
    setOpen(true);
  }

  return (
    <>
      <Button onClick={openModal} className="w-full sm:w-auto" data-share-trigger>
        <Share2 className="h-4 w-4" />
        Share Result
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[oklch(0.07_0.02_252_/_0.76)] p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-[20px] border border-[var(--line)] bg-[var(--bg-strong)] p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-3xl font-black">Share your company</h2>
              <button
                type="button"
                aria-label="Close share modal"
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-[var(--radius)] border border-[var(--line)] text-[var(--muted)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--muted)]">
                    Outcome
                  </p>
                  <p className="display-font mt-2 text-4xl">
                    {result.valuation}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--muted)]">
                    Score
                  </p>
                  <p className="mt-2 text-4xl font-black text-[var(--gold)]">
                    {result.score}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                {result.team
                  .filter((slot) => slot.person)
                  .map(({ role, person }) => (
                    <div
                      key={role}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[var(--radius)] bg-[var(--bg)] p-3"
                    >
                      <Avatar
                        name={person!.name}
                        className="h-10 w-10 rounded-xl"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-black">{person!.name}</p>
                        <p className="truncate text-sm text-[var(--muted)]">
                          {person!.knownFor}
                        </p>
                      </div>
                      <Badge tone="gold">{roleShortLabels[role]}</Badge>
                    </div>
                  ))}
              </div>
              <p className="mt-5 text-lg font-black">
                I built a {result.valuation} startup. Think you can beat it?
              </p>
            </div>

            <div className="mt-4 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
              {shareUrl}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="secondary" onClick={() => openSocial("x")}>
                <MessageCircle className="h-4 w-4" />X / Twitter
              </Button>
              <Button
                variant="secondary"
                onClick={() => openSocial("facebook")}
              >
                <Share2 className="h-4 w-4" />
                Facebook
              </Button>
              <Button
                variant="secondary"
                onClick={() => openSocial("linkedin")}
              >
                <Link className="h-4 w-4" />
                LinkedIn
              </Button>
              <Button
                variant="secondary"
                onClick={() => openSocial("whatsapp")}
              >
                <Send className="h-4 w-4" />
                WhatsApp
              </Button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Button variant="secondary" onClick={copyShare}>
                <Copy className="h-4 w-4" />
                Copy text
              </Button>
              <Button onClick={downloadImage}>
                <Download className="h-4 w-4" />
                Download image
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
