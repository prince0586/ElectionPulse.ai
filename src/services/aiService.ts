/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChatMessage, GroundingSource } from "../types";

/**
 * Institutional AI Intelligence Service powering grounded election advisory.
 * Updated to use full-stack proxying for institutional security.
 */
export async function processAdvisorQuery(
  query: string,
  history: ChatMessage[] = [],
  onUpdate?: (partial: string) => void
): Promise<Partial<ChatMessage>> {
  try {
    const response = await fetch('/api/advisor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, history }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Institutional AI connectivity failure.");
    }

    const data = await response.json();
    let text = data.text;

    // Institutional Parsing: Confidence Metadata
    let confidenceScore: number | undefined;
    const confidenceMatch = text.match(/\[CONFIDENCE:\s*(\d+)\]/i);
    if (confidenceMatch) {
      confidenceScore = parseInt(confidenceMatch[1], 10);
      text = text.replace(/\[CONFIDENCE:\s*\d+\]/gi, '').trim();
    }

    // Grounding Extraction from Candidates
    const citations: GroundingSource[] = [];
    const groundingMetadata = data.candidates?.[0]?.groundingMetadata;
    
    if (groundingMetadata?.searchEntryPoint?.renderedContent) {
      citations.push({
        title: "Google Search Grounding",
        url: "#",
        html: groundingMetadata.searchEntryPoint.renderedContent
      });
    }

    return {
      content: text,
      confidenceScore,
      citations,
      timestamp: data.timestamp || new Date().toISOString()
    };
  } catch (error) {
    console.error("[Institutional AI Service Error]:", error);
    throw new Error("AI intelligence unavailable at this protocol level. Please verify server connectivity.");
  }
}
