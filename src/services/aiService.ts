/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { AI_CONFIG } from "../constants";
import { ChatMessage, GroundingSource } from "../types";

let modelCache: any = null;

/**
 * Institutional AI Intelligence Service powering grounded election advisory.
 */
export async function getInstitutionalAdvisor() {
  const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Institutional Authentication Failure: GEMINI_API_KEY missing.");
  }

  if (!modelCache) {
    const genAI = new GoogleGenAI(apiKey);
    modelCache = (genAI as any).getGenerativeModel({
      model: AI_CONFIG.model,
      systemInstruction: AI_CONFIG.systemInstruction,
      tools: [{ googleSearch: {} } as any],
    }) as any;
  }

  return modelCache;
}

/**
 * Standardized analytical processing for incoming civic queries.
 */
export async function processAdvisorQuery(
  query: string,
  history: ChatMessage[] = [],
  onUpdate?: (partial: string) => void
): Promise<Partial<ChatMessage>> {
  try {
    const model = await getInstitutionalAdvisor();
    
    // Convert history to Gemini format
    const contents = history.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // Start Chat for context
    const chat = model.startChat({
      history: contents,
    });

    const result = await chat.sendMessage(query);
    const response = await result.response;
    let text = response.text();

    // Institutional Parsing: Confidence Metadata
    let confidenceScore: number | undefined;
    const confidenceMatch = text.match(/\[CONFIDENCE:\s*(\d+)\]/i);
    if (confidenceMatch) {
      confidenceScore = parseInt(confidenceMatch[1], 10);
      text = text.replace(/\[CONFIDENCE:\s*\d+\]/gi, '').trim();
    }

    // Grounding Extraction
    const groundingMetadata = (response as any).candidates?.[0]?.groundingMetadata;
    const citations: GroundingSource[] = [];
    
    if (groundingMetadata?.searchEntryPoint?.renderedContent) {
      citations.push({
        title: "Google Search Grounding",
        url: "#", // Placeholder as direct URLs often aren't in this specific metadata field easily
        html: groundingMetadata.searchEntryPoint.renderedContent
      });
    }

    return {
      content: text,
      confidenceScore,
      citations,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("[Institutional AI Error]:", error);
    throw new Error("AI intelligence unavailable at this protocol level.");
  }
}
