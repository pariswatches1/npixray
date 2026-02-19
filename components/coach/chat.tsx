"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Mail,
  Lock,
  ArrowRight,
  RefreshCw,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// ── Types ────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ScanData {
  provider: {
    npi: string;
    fullName: string;
    specialty: string;
    address: { city: string; state: string };
  };
  billing: {
    totalMedicarePatients: number;
    totalMedicarePayment: number;
    ccmPatients: number;
    rpmPatients: number;
    awvCount: number;
    em99213Count: number;
    em99214Count: number;
    em99215Count: number;
    emTotalCount: number;
  };
  totalMissedRevenue: number;
  ccmGap: { eligiblePatients: number; annualGap: number };
  rpmGap: { eligiblePatients: number; annualGap: number };
  bhiGap: { eligiblePatients: number; annualGap: number };
  awvGap: { eligiblePatients: number; annualGap: number };
  codingGap: { annualGap: number };
}

// ── Constants ────────────────────────────────────────────────

const FREE_MESSAGE_LIMIT = 3;
const EMAIL_MESSAGE_LIMIT = 8;
const SESSION_KEY = "npixray-coach-session";
const EMAIL_KEY = "npixray-coach-email";

const CONVERSATION_STARTERS = [
  {
    text: "How much revenue am I missing?",
    icon: Zap,
    requiresScan: true,
  },
  {
    text: "Explain CCM billing to me like I'm new",
    icon: MessageSquare,
    requiresScan: false,
  },
  {
    text: "What's the fastest way to add $50K in revenue?",
    icon: Sparkles,
    requiresScan: false,
  },
  {
    text: "Should I start RPM or CCM first?",
    icon: ArrowRight,
    requiresScan: false,
  },
  {
    text: "How do I improve my E&M coding?",
    icon: MessageSquare,
    requiresScan: false,
  },
  {
    text: "What codes should I be billing that I'm not?",
    icon: Zap,
    requiresScan: true,
  },
];

// ── Lead Topics Detection ────────────────────────────────────

const LEAD_TOPICS: Record<string, string[]> = {
  ccm: ["ccm", "chronic care", "99490", "99439", "care management"],
  rpm: ["rpm", "remote patient", "99454", "99457", "monitoring"],
  bhi: ["bhi", "behavioral", "99484", "mental health", "depression"],
  awv: ["awv", "wellness visit", "g0438", "g0439", "hra"],
  coding: ["coding", "e&m", "99213", "99214", "99215", "upcod", "downcod"],
  implementation: ["implement", "start", "setup", "begin", "launch", "how do i"],
  pricing: ["cost", "price", "investment", "roi", "worth it"],
};

function detectTopics(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const [topic, keywords] of Object.entries(LEAD_TOPICS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      found.push(topic);
    }
  }
  return found;
}

function calculateLeadScore(topics: string[]): "hot" | "warm" | "cold" {
  const hasImplementation = topics.includes("implementation");
  const hasPricing = topics.includes("pricing");
  const programTopics = topics.filter((t) =>
    ["ccm", "rpm", "bhi", "awv"].includes(t)
  );

  if (hasImplementation || hasPricing || programTopics.length >= 2) return "hot";
  if (programTopics.length >= 1 || topics.includes("coding")) return "warm";
  return "cold";
}

// ── Markdown-ish Renderer ────────────────────────────────────

function renderContent(text: string) {
  // Simple markdown: **bold**, bullet points, headers
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    let processed = line;

    // Bold
    processed = processed.replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="text-white font-semibold">$1</strong>'
    );

    // Headers
    if (processed.startsWith("### ")) {
      elements.push(
        <h4
          key={i}
          className="text-sm font-bold text-gold mt-4 mb-1"
          dangerouslySetInnerHTML={{
            __html: processed.replace("### ", ""),
          }}
        />
      );
    } else if (processed.startsWith("## ")) {
      elements.push(
        <h3
          key={i}
          className="text-base font-bold text-gold mt-4 mb-2"
          dangerouslySetInnerHTML={{
            __html: processed.replace("## ", ""),
          }}
        />
      );
    } else if (processed.startsWith("- ") || processed.startsWith("• ")) {
      elements.push(
        <li
          key={i}
          className="ml-4 text-sm text-[var(--text-secondary)] leading-relaxed list-disc"
          dangerouslySetInnerHTML={{
            __html: processed.replace(/^[-•]\s/, ""),
          }}
        />
      );
    } else if (
      /^\d+[\.\)]\s/.test(processed)
    ) {
      elements.push(
        <li
          key={i}
          className="ml-4 text-sm text-[var(--text-secondary)] leading-relaxed list-decimal"
          dangerouslySetInnerHTML={{ __html: processed }}
        />
      );
    } else if (processed.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p
          key={i}
          className="text-sm text-[var(--text-secondary)] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processed }}
        />
      );
    }
  });

  return <div className="space-y-0.5">{elements}</div>;
}

// ── Chat Component ───────────────────────────────────────────

export function CoachChat({ scanData }: { scanData?: ScanData | null }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [allTopics, setAllTopics] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load session from localStorage
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(EMAIL_KEY);
      if (savedEmail) {
        setEmail(savedEmail);
        setEmailSubmitted(true);
      }
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(parsed.messages || []);
        setUserMessageCount(parsed.userMessageCount || 0);
        setAllTopics(parsed.topics || []);
      }
    } catch {
      // Fresh session
    }
  }, []);

  // Save session
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            messages,
            userMessageCount,
            topics: allTopics,
          })
        );
      } catch {
        // Storage full
      }
    }
  }, [messages, userMessageCount, allTopics]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Two-tier gating: email gate at 3, hard paywall at 8
  const needsEmail =
    !emailSubmitted && userMessageCount >= FREE_MESSAGE_LIMIT;
  const needsUpgrade =
    emailSubmitted && userMessageCount >= EMAIL_MESSAGE_LIMIT;
  const isGated = needsEmail || needsUpgrade;

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming || isGated) return;

      const newUserMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      const newCount = userMessageCount + 1;
      setUserMessageCount(newCount);

      // Detect topics
      const topics = detectTopics(text);
      const updatedTopics = [...new Set([...allTopics, ...topics])];
      setAllTopics(updatedTopics);

      const updatedMessages = [...messages, newUserMsg];
      setMessages(updatedMessages);
      setInput("");
      setIsStreaming(true);

      // Track analytics
      trackEvent({
        action: "coach_message_sent",
        category: "coach",
        label: scanData ? "with_scan" : "no_scan",
        value: newCount,
      });

      // Create placeholder assistant message
      const assistantId = `assistant-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };
      setMessages([...updatedMessages, assistantMsg]);

      try {
        const response = await fetch("/api/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            scanData: scanData || undefined,
            specialty: scanData?.provider?.specialty,
          }),
        });

        if (!response.ok) {
          throw new Error("API error");
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullText += parsed.text;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, content: fullText }
                        : m
                    )
                  );
                }
              } catch {
                // Skip
              }
            }
          }
        }

        // Log conversation for lead scoring
        if (email || scanData?.provider?.npi) {
          try {
            fetch("/api/coach/log", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                npi: scanData?.provider?.npi || null,
                email: email || null,
                question: text,
                topics: updatedTopics,
                leadScore: calculateLeadScore(updatedTopics),
                messageCount: newCount,
                hasScan: !!scanData,
              }),
            }).catch(() => {});
          } catch {
            // Non-blocking
          }
        }
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "I'm sorry, I encountered an error. Please try again.",
                }
              : m
          )
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, isStreaming, isGated, userMessageCount, allTopics, scanData, email]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setEmailStatus("loading");

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          npi: scanData?.provider?.npi || "unknown",
          providerName: scanData?.provider?.fullName || "Coach User",
          specialty: scanData?.provider?.specialty || "Unknown",
          totalMissedRevenue: scanData?.totalMissedRevenue || 0,
        }),
      });

      localStorage.setItem(EMAIL_KEY, email.trim().toLowerCase());
      setEmailSubmitted(true);
      setEmailStatus("success");

      trackEvent({
        action: "coach_email_captured",
        category: "lead",
        label: calculateLeadScore(allTopics),
      });
    } catch {
      setEmailStatus("error");
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setUserMessageCount(0);
    setAllTopics([]);
    sessionStorage.removeItem(SESSION_KEY);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[800px]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-6">
        {messages.length === 0 ? (
          <EmptyState
            scanData={scanData}
            onSelect={(text) => sendMessage(text)}
          />
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center mt-0.5">
                  <Bot className="h-4 w-4 text-gold" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-gold/10 border border-gold/20"
                    : "bg-dark-300/50 border border-dark-50/50"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="text-sm text-white">{msg.content}</p>
                ) : msg.content ? (
                  renderContent(msg.content)
                ) : (
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Loader2 className="h-4 w-4 animate-spin text-gold" />
                    Thinking...
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-dark-300 border border-dark-50/50 flex items-center justify-center mt-0.5">
                  <User className="h-4 w-4 text-[var(--text-secondary)]" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Email Gate (3 free messages) */}
      {needsEmail && (
        <div className="mx-4 sm:mx-6 mb-4 rounded-2xl border border-gold/30 bg-gold/5 p-6 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 flex-shrink-0">
              <Lock className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Continue Your Coaching Session
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Enter your email to unlock {EMAIL_MESSAGE_LIMIT - FREE_MESSAGE_LIMIT} more coaching messages.
                We&apos;ll save your chat history for next time.
              </p>
            </div>
          </div>

          <form onSubmit={handleEmailSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
              <input
                type="email"
                required
                placeholder="you@practice.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-dark-50 bg-dark-500 py-3 pl-10 pr-4 text-sm placeholder:text-[var(--text-secondary)]/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/30 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={emailStatus === "loading"}
              className="flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-semibold text-dark hover:bg-gold-300 transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {emailStatus === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              Continue
            </button>
          </form>

          {emailStatus === "error" && (
            <p className="text-xs text-red-400 mt-2">
              Something went wrong. Please try again.
            </p>
          )}

          <p className="text-[10px] text-[var(--text-secondary)] mt-3">
            No spam. We&apos;ll only email you about revenue opportunities.
          </p>
        </div>
      )}

      {/* Hard Paywall (after 8 total messages) */}
      {needsUpgrade && (
        <div className="mx-4 sm:mx-6 mb-4 rounded-2xl border border-gold/30 bg-gold/5 p-6 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 flex-shrink-0">
              <Lock className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                You&apos;ve Used All Free Coaching Sessions
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Upgrade to Intelligence for unlimited AI coaching, personalized
                action plans, and patient eligibility lists.
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-5">
            {[
              "Unlimited AI Revenue Coach sessions",
              "Personalized 90-day action plan",
              "Patient eligibility lists (CCM, RPM, AWV)",
              "Monthly benchmark tracking & alerts",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Sparkles className="h-3.5 w-3.5 text-gold flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>

          <Link
            href="/pricing"
            className="flex items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-semibold text-dark hover:bg-gold-300 transition-all w-full"
          >
            <Zap className="h-4 w-4" />
            Upgrade to Intelligence — $99/mo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-dark-50/50 px-4 sm:px-6 py-4 bg-dark/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          {messages.length > 0 && (
            <button
              onClick={handleNewChat}
              className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-gold transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              New chat
            </button>
          )}
          {userMessageCount > 0 && !needsUpgrade && (
            <span className="text-xs text-[var(--text-secondary)] ml-auto">
              {emailSubmitted
                ? `${Math.max(0, EMAIL_MESSAGE_LIMIT - userMessageCount)} messages left`
                : `${Math.max(0, FREE_MESSAGE_LIMIT - userMessageCount)} free messages left`}
            </span>
          )}
          {scanData && (
            <span className="text-xs text-emerald-400 ml-auto flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Connected to {scanData.provider.fullName}&apos;s data
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isGated
                ? "Enter your email above to continue..."
                : scanData
                ? `Ask about ${scanData.provider.specialty} billing, revenue gaps, or programs...`
                : "Ask about Medicare billing, revenue optimization, or programs..."
            }
            disabled={isStreaming || isGated}
            rows={1}
            className="w-full resize-none rounded-2xl border border-dark-50 bg-dark-400/50 py-3.5 pl-4 pr-14 text-sm placeholder:text-[var(--text-secondary)]/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/30 outline-none transition-all disabled:opacity-50 max-h-32"
            style={{ minHeight: "48px" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming || isGated}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-dark hover:bg-gold-300 transition-all disabled:opacity-30 disabled:hover:bg-gold"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>

        <p className="text-[10px] text-[var(--text-secondary)] mt-2 text-center">
          AI Revenue Coach provides billing guidance, not medical advice.
          Always verify with your compliance team.
        </p>
      </div>
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────

function EmptyState({
  scanData,
  onSelect,
}: {
  scanData?: ScanData | null;
  onSelect: (text: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20 mb-6">
        <Sparkles className="h-8 w-8 text-gold" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-2">
        AI Revenue <span className="text-gold">Coach</span>
      </h2>
      <p className="text-sm text-[var(--text-secondary)] max-w-md mb-8 leading-relaxed">
        {scanData ? (
          <>
            I have{" "}
            <span className="text-gold font-medium">
              {scanData.provider.fullName}&apos;s
            </span>{" "}
            actual CMS billing data loaded. Ask me anything about your
            revenue — I&apos;ll give you specific numbers and actionable
            recommendations.
          </>
        ) : (
          <>
            Ask me anything about Medicare billing, revenue optimization,
            or care management programs. For personalized advice based on
            your actual data,{" "}
            <Link href="/" className="text-gold hover:underline font-medium">
              scan your NPI first
            </Link>
            .
          </>
        )}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {CONVERSATION_STARTERS.filter(
          (s) => !s.requiresScan || scanData
        ).map((starter) => (
          <button
            key={starter.text}
            onClick={() => onSelect(starter.text)}
            className="group flex items-center gap-3 rounded-xl border border-dark-50/80 bg-dark-400/50 px-4 py-3 text-left transition-all hover:border-gold/30 hover:bg-gold/5"
          >
            <starter.icon className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-gold flex-shrink-0 transition-colors" />
            <span className="text-sm text-[var(--text-secondary)] group-hover:text-white transition-colors">
              {starter.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
