import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type Candidate = {
  name: string;
  hint?: string;
};

type ReviewRecord = Candidate & {
  wikipedia?: {
    title?: string;
    description?: string;
    extract?: string;
    url?: string;
  };
  review: {
    status: "needs-human-review";
    notes: string[];
  };
};

async function readCandidates(filePath: string): Promise<Candidate[]> {
  const raw = await readFile(filePath, "utf8");

  if (filePath.endsWith(".json")) {
    return JSON.parse(raw) as Candidate[];
  }

  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((name) => ({ name }));
}

async function fetchWikipediaSummary(name: string) {
  const title = encodeURIComponent(name.replaceAll(" ", "_"));
  const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);

  if (!response.ok) {
    return undefined;
  }

  const data = await response.json() as {
    title?: string;
    description?: string;
    extract?: string;
    content_urls?: { desktop?: { page?: string } };
  };

  return {
    title: data.title,
    description: data.description,
    extract: data.extract,
    url: data.content_urls?.desktop?.page,
  };
}

async function enrich() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    throw new Error("Usage: npm exec tsx scripts/enrich-people.ts ./candidate-names.txt");
  }

  const candidates = await readCandidates(inputPath);
  const records: ReviewRecord[] = [];

  for (const candidate of candidates) {
    const wikipedia = await fetchWikipediaSummary(candidate.name).catch(() => undefined);
    records.push({
      ...candidate,
      wikipedia,
      review: {
        status: "needs-human-review",
        notes: [
          "Verify current company, handle, and public bio before using.",
          "Assign role, stats, tags, and funny copy manually.",
          "Do not publish this generated record directly into data/people.ts.",
        ],
      },
    });
  }

  const outputDir = path.join(process.cwd(), "review-output");
  await mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `people-enrichment-${Date.now()}.json`);
  await writeFile(outputPath, JSON.stringify(records, null, 2));
  console.log(`Wrote ${records.length} review records to ${outputPath}`);
}

enrich().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
