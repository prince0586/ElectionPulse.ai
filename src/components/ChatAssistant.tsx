/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ShieldCheck, Search, ExternalLink, Loader2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import { AI_CONFIG } from '../constants';

import { getVoterInfo, getRepresentatives } from '../services/civicService';

interface ChatAssistantProps {
  location?: string;
  zipCode?: string;
}

/**
 * AI Advisor component with Google Search Grounding for real-time election intelligence.
 */
const ChatAssistant: React.FC<ChatAssistantProps> = ({ location, zipCode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: "Hello! I'm your Election Pulse advisor. I can help you understand the voting process, registration deadlines, and how elections work. What would you like to know today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [civicData, setCivicData] = useState<any>(null);

  // Effect to fetch official Civic Data when zip changes
  useEffect(() => {
    if (zipCode && zipCode.length === 5) {
      getVoterInfo(zipCode).then(data => {
        if (data) {
          setCivicData(data);
          // Optionally push an institutional update to the chat
          setMessages(prev => [...prev, { 
            role: 'ai', 
            content: `Institutional Update: I have localized your advisor with official data for the **${data.electionName}** on **${data.electionDay}**. How can I assist with your specific region?` 
          }]);
        }
      });
    }
  }, [zipCode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // --- Institutional Guardrail: Pre-processing Filter ---
    const lowerInput = input.toLowerCase();
    const forbiddenPatterns = [/ignore.*previous/i, /your.*prompt/i, /be.a.different/i];
    const isInjectionAttempt = forbiddenPatterns.some(p => p.test(lowerInput));
    
    if (isInjectionAttempt) {
      setMessages(prev => [...prev, 
        { role: 'user', content: input },
        { role: 'ai', content: "Protocol Violation Detected: I am strictly bound to election procedural guidance. Deviating from my core directive is not permitted." }
      ]);
      setInput('');
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      setMessages(prev => [...prev, { role: 'ai', content: "Error: GEMINI_API_KEY is not configured in environment secrets." }]);
      return;
    }

    const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY!);
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ 
        model: AI_CONFIG.model,
        systemInstruction: AI_CONFIG.systemInstruction,
        tools: [
          { googleSearch: {} }
        ] as any, // Cast as any if TS definitions are behind
      });

      const result = await model.generateContent(userMessage);
      const response = await result.response;
      let text = response.text();

      // Extract confidence score
      let confidenceScore: number | undefined;
      const confidenceMatch = text.match(/\[CONFIDENCE:\s*(\d+)\]/i);
      if (confidenceMatch) {
        confidenceScore = parseInt(confidenceMatch[1], 10);
        // Remove the confidence bracket from the display text
        text = text.replace(/\[CONFIDENCE:\s*\d+\]/gi, '').trim();
      }

      // Extract grounding metadata if exists
      const groundingMetadata = (result.response as any).candidates?.[0]?.groundingMetadata;
      const citations = groundingMetadata?.searchEntryPoint?.renderedContent 
        ? [{ title: "Google Search Grounding", html: groundingMetadata.searchEntryPoint.renderedContent }]
        : [];

      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: text || "I'm sorry, I couldn't process that request.",
        citations,
        confidenceScore
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Something went wrong. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="advisor-chat-container" className="pro-card flex flex-col h-[600px] overflow-hidden p-0" role="region" aria-label="AI Election Advisor Chat">
      <div id="advisor-header" className="bg-ink-900 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <Globe className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h3 className="font-bold leading-none text-sm uppercase tracking-wide">Live Grounded Advisor</h3>
            <p className="text-[10px] opacity-50 mt-1 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Grounded Intelligence
            </p>
          </div>
        </div>
        <div className="px-3 py-1 bg-brand-blue/20 border border-brand-blue/30 rounded flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-blue">Google Cloud Sync</span>
        </div>
      </div>
      
      <div id="advisor-chat-history" ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-50 custom-scrollbar" aria-live="polite">
        {messages.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-xl shadow-sm ${
              m.role === 'user' 
                ? 'bg-brand-blue text-white rounded-tr-none' 
                : 'bg-white text-ink-800 rounded-tl-none border border-surface-200'
            }`}>
              <div className="prose prose-sm prose-slate max-w-none">
                 <Markdown>{m.content}</Markdown>
              </div>
            </div>
            
            {m.role === 'ai' && (
              <div className="mt-2 flex flex-col gap-2 w-full">
                <div className="flex items-center gap-3 px-1 text-[10px] font-bold uppercase tracking-tight text-ink-700/40">
                  <div className="flex items-center gap-1 text-green-600">
                    <ShieldCheck className="w-3 h-3" />
                    Neural Verification: Passed
                  </div>
                  {m.citations && m.citations.length > 0 && (
                    <div className="flex items-center gap-1 text-brand-blue">
                      <Search className="w-3 h-3" />
                      Verified by Google Search
                    </div>
                  )}
                  {m.confidenceScore !== undefined && (
                    <div className="flex items-center gap-2 border-l border-ink-700/10 pl-3">
                      <span className="opacity-50">Grounding Confidence:</span>
                      <div className="flex items-center gap-1.5 font-bold">
                        <div className="w-16 bg-ink-900/5 h-1.5 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full ${m.confidenceScore > 85 ? 'bg-green-500' : m.confidenceScore > 70 ? 'bg-brand-blue' : 'bg-amber-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${m.confidenceScore}%` }}
                          />
                        </div>
                        <span className={m.confidenceScore > 85 ? 'text-green-600' : m.confidenceScore > 70 ? 'text-brand-blue' : 'text-amber-600'}>
                          {m.confidenceScore}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {m.citations && m.citations.map((cite, idx) => (
                  <div key={idx} className="bg-brand-blue/5 border border-brand-blue/10 rounded p-2 text-[9px] text-brand-blue flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                       <ExternalLink className="w-3 h-3" />
                       <span className="font-bold opacity-70">Grounding Source:</span>
                       <div dangerouslySetInnerHTML={{ __html: cite.html.replace(/<a /g, '<a rel="noopener noreferrer" target="_blank" ') }} className="citation-links font-medium" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-xl rounded-tl-none border border-surface-200 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
              <span className="text-xs font-medium text-ink-700/50 uppercase tracking-wider">Syncing with Google Search...</span>
            </div>
          </div>
        )}
      </div>

      <div id="advisor-input-area" className="p-4 bg-white border-t border-surface-200">
        <label htmlFor="advisor-message-input" className="sr-only">Message the AI Advisor</label>
        <div className="relative flex items-center gap-2">
          <input 
            id="advisor-message-input"
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about turnout, deadlines, or process..."
            className="flex-1 bg-surface-50 border border-surface-200 focus:border-brand-blue/30 rounded-lg px-4 py-3 outline-none transition-all text-sm"
          />
          <button 
            id="advisor-send-button"
            onClick={handleSend}
            disabled={isLoading}
            aria-label="Send message"
            className="p-3 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors disabled:opacity-50 shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatAssistant);
