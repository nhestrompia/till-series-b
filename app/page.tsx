"use client";

import { trackGameEvent } from "@/lib/analytics";
import { getRosterSize } from "@/lib/game";
import { useGameStore } from "@/store/game-store";
import { motion } from "framer-motion";
import { ArrowRight, Boxes, Flag, Rocket, Sparkles, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";

const previewPeople = [
  { initials: "SA", name: "Sam Altman", tone: "violet" },
  { initials: "PG", name: "Paul Graham", tone: "green" },
  { initials: "IS", name: "Ilya Sutskever", tone: "gold" },
  { initials: "DF", name: "Dylan Field", tone: "blue" },
];

const roles = ["CEO", "CTO", "Product", "Growth"];

const categories = [
  { label: "OpenAI", mark: "◎", tone: "violet" },
  { label: "Stripe", mark: "///", tone: "green" },
  { label: "Tech Twitter", mark: "✦", tone: "blue" },
  { label: "Crypto Twitter", mark: "◆", tone: "gold" },
  { label: "Y Combinator", mark: "Y", tone: "coral" },
];

const steps = [
  {
    icon: Sparkles,
    number: "01",
    title: "Draft",
    copy: "Four rounds. Four categories. One pick from each.",
  },
  {
    icon: Users,
    number: "02",
    title: "Build",
    copy: "Fill CEO, CTO, product, and growth with your dream team.",
  },
  {
    icon: Flag,
    number: "03",
    title: "Survive",
    copy: "See your rating, valuation, strengths, and fatal flaws.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const startGame = useGameStore((state) => state.startGame);
  const lastCompanyName = useGameStore((state) => state.lastCompanyName);
  const [companyName, setCompanyName] = useState("");
  const hasEditedCompanyName = useRef(false);

  useEffect(() => {
    if (lastCompanyName && !hasEditedCompanyName.current) {
      setCompanyName(lastCompanyName);
    }
  }, [lastCompanyName]);

  function start(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = companyName.trim();
    if (!name) return;

    startGame(name);
    trackGameEvent("game_started", { roster_size: getRosterSize() });
    router.push("/play");
  }

  function focusCompanyName() {
    const input = document.getElementById("company-name");
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => input?.focus(), 350);
  }

  return (
    <main className="home-page">
      <div className="home-ambient" aria-hidden="true" />

      <header className="home-header">
        <a className="home-brand" href="#" aria-label="Till Series B home">
          <Image
            src="/till.png"
            alt=""
            width={1254}
            height={1254}
            priority
            className="home-brand-image"
          />
          <span>
            <strong>Till Series B</strong>
            <small>The startup draft</small>
          </span>
        </a>

        <div className="home-manifesto">
          <span>No skips.</span>
          <span>Just picks.</span>
          <span>Live with it.</span>
        </div>
      </header>

      <section className="home-hero">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="home-hero-copy"
        >
          <div className="home-eyebrow">
            <span>4 rounds</span>
            <span>4 roles</span>
            <span>zero take-backs</span>
          </div>
          <h1>
            Can you make it
            <br />
            till <em>Series B?</em>
          </h1>
          <p>
            Draft your startup team from tech&apos;s most iconic builders,
            operators, and chaos merchants.
          </p>

          <form className="home-start-form" onSubmit={start}>
            <label className="home-company-label" htmlFor="company-name">
              Name your company
            </label>
            <div className="home-company-row">
              <input
                id="company-name"
                name="companyName"
                type="text"
                value={companyName}
                onChange={(event) => {
                  hasEditedCompanyName.current = true;
                  setCompanyName(event.target.value);
                }}
                maxLength={40}
                autoComplete="organization"
                placeholder="e.g. Orbit Labs"
                required
                aria-describedby="company-name-hint"
                className="home-company-input"
              />
              <button
                type="submit"
                disabled={!companyName.trim()}
                className="home-cta"
              >
                <Rocket aria-hidden="true" />
                Start game
                <ArrowRight aria-hidden="true" className="home-cta-arrow" />
              </button>
            </div>
            <span id="company-name-hint" className="home-company-hint">
              This name appears on your final card and shared image.
            </span>
          </form>
          <span className="home-no-signup">No signup. Just play.</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, rotate: 4, scale: 0.96 }}
          animate={{ opacity: 1, rotate: 1.5, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="home-hero-art"
          aria-hidden="true"
        >
          <Image src="/till.png" alt="" width={1254} height={1254} priority />
          <span className="home-art-note">Pick wisely.</span>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="draft-preview"
        aria-label="Game preview"
      >
        <div className="draft-preview-header">
          <div>
            <span className="draft-round">Round 1 of 4</span>
            <h2>
              Pick your <em>CEO</em>
            </h2>
          </div>
          <span className="draft-rule">
            <Boxes aria-hidden="true" />
            Four candidates. One pick.
          </span>
        </div>

        <div className="draft-cards">
          {previewPeople.map((person, index) => (
            <article
              key={person.name}
              className={`draft-card draft-card-${person.tone}`}
            >
              <span className="draft-card-number">0{index + 1}</span>
              <div className="draft-avatar">
                <span>{person.initials}</span>
              </div>
              <h3>{person.name}</h3>
              <button type="button" onClick={focusCompanyName}>
                Pick
              </button>
            </article>
          ))}
        </div>

        <div className="team-strip">
          <div className="team-strip-label">
            <span>Your startup</span>
            <small>Make it to Series B</small>
          </div>
          <div className="team-slots">
            {roles.map((role, index) => (
              <div className="team-slot" key={role}>
                <span>?</span>
                <small>Pick {index + 1}</small>
                <strong>{role}</strong>
              </div>
            ))}
          </div>
          <Flag className="team-flag" aria-hidden="true" />
        </div>
      </motion.section>

      <section className="home-categories" aria-labelledby="categories-title">
        <div className="home-section-title">
          <span>Popular pools</span>
          <h2 id="categories-title">Who could show up?</h2>
        </div>
        <div className="category-list">
          {categories.map((category) => (
            <span
              key={category.label}
              className={`category-chip category-chip-${category.tone}`}
            >
              <i>{category.mark}</i>
              {category.label}
            </span>
          ))}
          <span className="category-chip category-chip-more">+ 27 more</span>
        </div>
      </section>

      <section className="home-how" aria-labelledby="how-title">
        <div className="home-section-title">
          <span>Simple rules. Bad decisions.</span>
          <h2 id="how-title">How it works</h2>
        </div>

        <div className="how-grid">
          {steps.map((step, index) => (
            <article className="how-step" key={step.title}>
              <span className="how-number">{step.number}</span>
              <step.icon aria-hidden="true" />
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
              {index < steps.length - 1 ? (
                <ArrowRight className="how-arrow" aria-hidden="true" />
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <span>{getRosterSize()} people in the draft pool</span>
        <span>Made for fun. Not affiliated with anyone featured.</span>
      </footer>
    </main>
  );
}
