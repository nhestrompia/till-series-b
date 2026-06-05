"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trackGameEvent } from "@/lib/analytics";
import { roleShortLabels } from "@/lib/game";
import { SHARE_URL, shareText } from "@/lib/result-copy";
import type { StartupResult } from "@/lib/scoring";
import { toBlob } from "html-to-image";
import {
  Clipboard,
  Copy,
  Download,
  Link,
  MessageCircle,
  Send,
  Share2,
} from "lucide-react";
import type React from "react";
import { useMemo, useRef, useState } from "react";

type ShareButtonProps = {
  target: React.RefObject<HTMLElement | null>;
  result: StartupResult;
  companyName: string;
};

export function ShareButton({ target, result, companyName }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [imageReady, setImageReady] = useState(false);
  const imageBlobRef = useRef<Blob | null>(null);
  const text = useMemo(
    () => shareText(result, companyName),
    [companyName, result],
  );
  const filename = `${companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "startup"}-result.png`;

  async function createResultImage() {
    if (imageBlobRef.current) return imageBlobRef.current;

    if (!target.current) {
      throw new Error("The result card is not ready yet.");
    }

    const blob = await toBlob(target.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "oklch(0.13 0.035 285)",
    });

    if (!blob) {
      throw new Error("The result image could not be created.");
    }

    imageBlobRef.current = blob;
    setImageReady(true);
    return blob;
  }

  async function downloadImage() {
    try {
      const blob = await createResultImage();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
      setFeedback("Image downloaded.");
    } catch {
      setFeedback("Could not download the image.");
    }
  }

  async function copyImage() {
    if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
      setFeedback("Image copying is not supported here. Download it instead.");
      return false;
    }

    try {
      const blob = await createResultImage();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setFeedback("Image copied. Paste it into your post.");
      return true;
    } catch {
      setFeedback("Could not copy the image. Download it instead.");
      return false;
    }
  }

  async function shareImage() {
    const blob = imageBlobRef.current;

    if (!blob) {
      setFeedback("The image is still being prepared.");
      return;
    }

    try {
      const file = new File([blob], filename, { type: "image/png" });
      const shareData = {
        files: [file],
        text,
        title: `${companyName} | Till Series B`,
      };

      if (!navigator.share || !navigator.canShare?.(shareData)) {
        setFeedback("File sharing is not supported here. Copy or download the image instead.");
        return;
      }

      await navigator.share(shareData);
      setFeedback("Shared.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setFeedback("Could not open the share sheet. Copy or download the image instead.");
    }
  }

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(text);
      setFeedback("Text and link copied.");
    } catch {
      setFeedback("Could not copy the text.");
    }
  }

  async function openSocial(kind: "x" | "facebook" | "linkedin" | "whatsapp") {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(SHARE_URL);
    const urls = {
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text.replace(`\n${SHARE_URL}`, ""),
      )}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
    };

    const socialWindow = window.open("", "_blank");

    if (kind === "x") {
      const copied = await copyImage();
      if (copied) {
        setFeedback("Image copied. Paste it into the X composer.");
      }
    }

    if (socialWindow) {
      socialWindow.opener = null;
      socialWindow.location.href = urls[kind];
    } else {
      window.open(urls[kind], "_blank", "noopener,noreferrer");
    }
  }

  function openModal() {
    trackGameEvent("share_clicked", {
      outcome: result.tier,
      score: result.score,
    });
    setFeedback("");
    setImageReady(Boolean(imageBlobRef.current));
    setOpen(true);
    void createResultImage().catch(() => {
      setFeedback("Could not prepare the image. Text sharing still works.");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={openModal} className="w-full sm:w-auto" data-share-trigger>
          <Share2 className="h-4 w-4" />
          Share Result
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Share {companyName}</DialogTitle>
          <DialogDescription>
            Export the result card or share the final valuation with your network.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--panel-cool)] p-4">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                {companyName}
              </p>
              <p className="mt-2 text-3xl font-semibold">{result.valuation}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Score
              </p>
              <p className="mt-2 text-3xl font-semibold text-[var(--gold)]">
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
                  <Avatar name={person!.name} className="h-10 w-10 rounded-xl" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{person!.name}</p>
                    <p className="truncate text-sm text-[var(--muted)]">
                      {person!.knownFor}
                    </p>
                  </div>
                  <Badge tone="gold">{roleShortLabels[role]}</Badge>
                </div>
              ))}
          </div>
          <p className="mt-4 text-base font-semibold">
            I built {companyName}, a {result.valuation} startup. Think you can
            pass this?
          </p>
        </div>

        <div className="mt-4 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--muted)]">
          {SHARE_URL}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="secondary" onClick={() => openSocial("x")}>
            <MessageCircle className="h-4 w-4" />X / Twitter
          </Button>
          <Button variant="secondary" onClick={() => openSocial("facebook")}>
            <Share2 className="h-4 w-4" />
            Facebook
          </Button>
          <Button variant="secondary" onClick={() => openSocial("linkedin")}>
            <Link className="h-4 w-4" />
            LinkedIn
          </Button>
          <Button variant="secondary" onClick={() => openSocial("whatsapp")}>
            <Send className="h-4 w-4" />
            WhatsApp
          </Button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="secondary" onClick={copyShare}>
            <Copy className="h-4 w-4" />
            Copy text + link
          </Button>
          <Button variant="secondary" onClick={copyImage}>
            <Clipboard className="h-4 w-4" />
            Copy image
          </Button>
          <Button variant="secondary" onClick={downloadImage}>
            <Download className="h-4 w-4" />
            Download image
          </Button>
          <Button onClick={shareImage} disabled={!imageReady}>
            <Share2 className="h-4 w-4" />
            {imageReady ? "Share image" : "Preparing image..."}
          </Button>
        </div>

        <p
          className="min-h-5 text-center text-sm text-[var(--muted)]"
          role="status"
          aria-live="polite"
        >
          {feedback && (
            <span>{feedback}</span>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}
