// ─────────────────────────────────────────────────────────────────────────────
// buildResourceContext
//
// Retrieves the most relevant Penn resources for a given user query using
// vector similarity search (RAG).  Falls back to returning all stored
// resources (capped at MAX_FALLBACK) when no embedding provider is configured.
//
// The returned string is injected into the LLM system prompt.
// ─────────────────────────────────────────────────────────────────────────────

import "server-only";
import { embeddingProvider, resourceRepository } from "./container";
import type { Resource } from "@penntools/core/resources";

const TOP_K = 5;
const MAX_FALLBACK = 10;

function formatResource(r: Resource, index: number): string {
  return [
    `${index + 1}. **${r.title}**`,
    `   URL: ${r.url}`,
    `   ${r.content}`,
  ].join("\n");
}

export async function buildResourceContext(query: string): Promise<string> {
  let results: Resource[];

  if (embeddingProvider) {
    try {
      const queryEmbedding = await embeddingProvider.embed(query);
      results = await resourceRepository.searchSimilar(queryEmbedding, TOP_K);
    } catch {
      // Embedding call failed — degrade gracefully
      results = (await resourceRepository.listAll()).slice(0, MAX_FALLBACK);
    }
  } else {
    results = (await resourceRepository.listAll()).slice(0, MAX_FALLBACK);
  }

  if (results.length === 0) return "";

  const entries = results.map(formatResource).join("\n\n");
  return (
    "## Relevant Penn Resources\n" +
    "Use the following resources to answer the user's question. Always include the URL.\n\n" +
    entries
  );
}
