"use client";

import {
  BarChart3,
  Blocks,
  HelpCircle,
  MousePointer2,
  Users,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const steps = [
  {
    icon: Users,
    title: "Reveal a group",
    copy: "Spin to reveal a company, scene, or category and everyone available in it.",
    tone: "text-[var(--pink)] bg-[color-mix(in_oklch,var(--pink),transparent_88%)]",
  },
  {
    icon: MousePointer2,
    title: "Choose one person",
    copy: "Compare role fit and stats, then select the person you want to draft.",
    tone: "text-[var(--cyan)] bg-[color-mix(in_oklch,var(--cyan),transparent_88%)]",
  },
  {
    icon: Blocks,
    title: "Place their role",
    copy: "Assign the pick to one compatible open role on your formation board.",
    tone: "text-[var(--gold)] bg-[color-mix(in_oklch,var(--gold),transparent_88%)]",
  },
  {
    icon: BarChart3,
    title: "Complete the team",
    copy: "Fill all four roles to reveal your rating, valuation, strengths, and risks.",
    tone: "text-[var(--acid)] bg-[color-mix(in_oklch,var(--acid),transparent_88%)]",
  },
];

export function HowToPlayDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="How to play"
          title="How to play"
          className="grid h-10 w-10 place-items-center rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] transition hover:border-[var(--cyan)] hover:text-[var(--cyan)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acid)]"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How to play</DialogTitle>
          <DialogDescription>
            Draft four people into four startup roles. Every choice changes the final score.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="grid grid-cols-[auto_1fr] gap-3 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--bg)] p-3"
            >
              <div className={`grid h-10 w-10 place-items-center rounded-[var(--radius)] ${step.tone}`}>
                <step.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">
                  {index + 1}. {step.title}
                </p>
                <p className="mt-1 text-sm leading-5 text-[var(--muted)]">{step.copy}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 rounded-[var(--radius)] bg-[color-mix(in_oklch,var(--gold),transparent_90%)] px-3 py-2.5 text-sm text-[color-mix(in_oklch,var(--gold),var(--text)_18%)]">
          A person can only fill their primary or secondary role. Filled roles stay locked.
        </p>
      </DialogContent>
    </Dialog>
  );
}
