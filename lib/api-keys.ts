/**
 * API key management for the NPIxray public API.
 * Keys stored in data/api-keys.json.
 * Rate limiting tracked in-memory (resets on deploy).
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const KEYS_FILE = join(DATA_DIR, "api-keys.json");

// ── Types ──────────────────────────────────────────────────

export interface ApiKey {
  key: string;
  name: string;
  email: string;
  tier: "free" | "pro";
  createdAt: string;
  lastUsedAt?: string;
  totalRequests: number;
  active: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: string;
}

// ── In-memory rate limit tracking ──────────────────────────

interface RateBucket {
  count: number;
  resetAt: number;
}

const rateLimits = new Map<string, RateBucket>();

const TIER_LIMITS: Record<string, number> = {
  free: 100,
  pro: 10000,
  anonymous: 100,
};

function getDayResetTime(): number {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return tomorrow.getTime();
}

export function checkRateLimit(identifier: string, tier: string = "anonymous"): RateLimitResult {
  const now = Date.now();
  const limit = TIER_LIMITS[tier] || TIER_LIMITS.anonymous;
  let bucket = rateLimits.get(identifier);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: getDayResetTime() };
    rateLimits.set(identifier, bucket);
  }

  bucket.count++;
  const allowed = bucket.count <= limit;
  const remaining = Math.max(0, limit - bucket.count);
  const resetAt = new Date(bucket.resetAt).toISOString();

  return { allowed, remaining, limit, resetAt };
}

// ── Key storage ────────────────────────────────────────────

function readKeys(): ApiKey[] {
  try {
    if (!existsSync(KEYS_FILE)) return [];
    return JSON.parse(readFileSync(KEYS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeKeys(keys: ApiKey[]): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2), "utf-8");
}

export function generateApiKey(): string {
  const prefix = "npx";
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let key = `${prefix}_`;
  for (let i = 0; i < 32; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

export function createApiKey(name: string, email: string, tier: "free" | "pro" = "free"): ApiKey {
  const keys = readKeys();
  const apiKey: ApiKey = {
    key: generateApiKey(),
    name,
    email,
    tier,
    createdAt: new Date().toISOString(),
    totalRequests: 0,
    active: true,
  };
  keys.push(apiKey);
  writeKeys(keys);
  return apiKey;
}

export function validateApiKey(key: string): ApiKey | null {
  const keys = readKeys();
  const found = keys.find((k) => k.key === key && k.active);
  if (found) {
    found.lastUsedAt = new Date().toISOString();
    found.totalRequests++;
    writeKeys(keys);
  }
  return found ?? null;
}

export function getAllApiKeys(): ApiKey[] {
  return readKeys();
}

export function revokeApiKey(key: string): boolean {
  const keys = readKeys();
  const found = keys.find((k) => k.key === key);
  if (!found) return false;
  found.active = false;
  writeKeys(keys);
  return true;
}

export function getApiKeyStats(): {
  total: number;
  active: number;
  pro: number;
  totalRequests: number;
} {
  const keys = readKeys();
  return {
    total: keys.length,
    active: keys.filter((k) => k.active).length,
    pro: keys.filter((k) => k.tier === "pro" && k.active).length,
    totalRequests: keys.reduce((sum, k) => sum + k.totalRequests, 0),
  };
}
