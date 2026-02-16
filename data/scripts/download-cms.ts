#!/usr/bin/env npx tsx
/**
 * CMS Medicare Physician & Other Practitioners — Data Download Script
 *
 * Downloads the full CMS dataset (~2GB CSV) with streaming and progress.
 *
 * Usage:
 *   npx tsx data/scripts/download-cms.ts
 *   — or —
 *   npm run cms:download
 *
 * Output:
 *   data/cms-raw/medicare-physician-services.csv
 */

import { createWriteStream, existsSync, mkdirSync, statSync, unlinkSync } from "fs";
import { join } from "path";
import { Writable } from "stream";
import { pipeline } from "stream/promises";

// CMS data.cms.gov bulk download endpoint
const CMS_DOWNLOAD_URL =
  "https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners/medicare-physician-other-practitioners-by-provider-and-service/api/1/datastore/query/0/0/download?format=csv";

const OUTPUT_DIR = join(process.cwd(), "data", "cms-raw");
const OUTPUT_FILE = join(OUTPUT_DIR, "medicare-physician-services.csv");

// ── Helpers ───────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(0)} KB`;
  return `${bytes} B`;
}

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

// ── Progress Writer ───────────────────────────────────────

function createProgressWriter(
  dest: Writable,
  totalBytes: number | null
): Writable {
  let bytesWritten = 0;
  let lastLogTime = 0;

  return new Writable({
    write(chunk: Buffer, _encoding, callback) {
      bytesWritten += chunk.length;
      dest.write(chunk);

      const now = Date.now();
      if (now - lastLogTime > 2000) {
        lastLogTime = now;
        const pct = totalBytes
          ? ` (${((bytesWritten / totalBytes) * 100).toFixed(1)}%)`
          : "";
        process.stdout.write(
          `\r  ↓ Downloaded ${formatBytes(bytesWritten)}${pct}    `
        );
      }

      callback();
    },
    final(callback) {
      process.stdout.write(
        `\r  ✓ Downloaded ${formatBytes(bytesWritten)}                \n`
      );
      dest.end(callback);
    },
  });
}

// ── Main ──────────────────────────────────────────────────

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  NPIxray — CMS Data Download");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`  Created ${OUTPUT_DIR}`);
  }

  // Check if file already exists
  if (existsSync(OUTPUT_FILE)) {
    const stat = statSync(OUTPUT_FILE);
    console.log(
      `  ⚠ Existing file found: ${formatBytes(stat.size)}`
    );
    console.log("  Delete data/cms-raw/medicare-physician-services.csv to re-download.\n");

    const answer = await askYesNo("  Overwrite existing file?");
    if (!answer) {
      console.log("  Skipped. Existing file will be used.\n");
      return;
    }
    unlinkSync(OUTPUT_FILE);
  }

  console.log(`  Source: data.cms.gov`);
  console.log(`  Dataset: Medicare Physician & Other Practitioners`);
  console.log(`  Output: ${OUTPUT_FILE}\n`);

  const startTime = Date.now();

  console.log("  Starting download (this file is ~2 GB, may take 5-15 minutes)...\n");

  const response = await fetch(CMS_DOWNLOAD_URL, {
    headers: {
      "User-Agent": "NPIxray/1.0 (https://npixray.com)",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Download failed: HTTP ${response.status} ${response.statusText}`
    );
  }

  if (!response.body) {
    throw new Error("No response body — cannot stream download.");
  }

  const totalBytes = response.headers.get("content-length")
    ? parseInt(response.headers.get("content-length")!, 10)
    : null;

  if (totalBytes) {
    console.log(`  File size: ${formatBytes(totalBytes)}\n`);
  }

  // Stream to disk
  const fileStream = createWriteStream(OUTPUT_FILE);
  const progressWriter = createProgressWriter(fileStream, totalBytes);

  // Convert Web ReadableStream to Node stream
  const reader = response.body.getReader();
  const nodeReadable = new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });

  // Use pipeline for proper backpressure
  const { Readable } = await import("stream");
  const nodeStream = Readable.fromWeb(nodeReadable as import("stream/web").ReadableStream);
  await pipeline(nodeStream, progressWriter);

  const elapsed = Date.now() - startTime;
  const finalSize = statSync(OUTPUT_FILE).size;

  console.log(`\n  ━━ Download Complete ━━`);
  console.log(`  File: ${OUTPUT_FILE}`);
  console.log(`  Size: ${formatBytes(finalSize)}`);
  console.log(`  Time: ${formatDuration(elapsed)}`);
  console.log(`  Speed: ${formatBytes(finalSize / (elapsed / 1000))}/s\n`);

  // Quick validation: read first line to check headers
  const { createReadStream } = await import("fs");
  const { createInterface } = await import("readline");
  const rl = createInterface({
    input: createReadStream(OUTPUT_FILE),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const headers = line.split(",").slice(0, 5);
    console.log(`  Header preview: ${headers.join(", ")}...`);
    rl.close();
    break;
  }

  console.log(`\n  Next step: npm run cms:process\n`);
}

// Utility for Y/N prompt
function askYesNo(question: string): Promise<boolean> {
  return new Promise((resolve) => {
    const { createInterface } = require("readline");
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(`${question} (y/N) `, (answer: string) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
}

main().catch((err) => {
  console.error("\n  ✗ Download failed:", err.message);
  process.exit(1);
});
