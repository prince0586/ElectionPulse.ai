/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Globe, ShieldCheck, Search, ExternalLink, Loader2, Send } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { ChatMessage } from '../types';
import { processAdvisorQuery } from '../services/aiService';
import { getVoterInfo } from '../services/civicService';

interface ChatAssistantProps {
  location?: string;
  zipCode?: string;
}

/**
 * Institutional AI Advisor component.
 * Optimized for minimal re-renders and grounded informational integrity.
 */
const ChatAssistant: React.FC<ChatAssistantProps> = ({ location, zipCode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'ai', 
      content: "Hello! I'm your Election Pulse advisor. I can help you understand the voting process, registration deadlines, and how elections work. What would you like to know today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle analytical civic sync
  useEffect(() => {
    if (zipCode && (zipCode.length === 5 || zipCode.length === 6)) {
      getVoterInfo(zipCode)
        .then(data => {
          if (data) {
            setMessages(prev => {
              const lastIsSync = prev[prev.length - 1]?.content.includes('Institutional Sync: Localized');
              if (lastIsSync) return prev;
              return [...prev, { 
                role: 'ai', 
                content: `Institutional Sync: Localized for **${data.electionName}**. Official protocols reconciled for ${zipCode}.`,
                timestamp: new Date().toISOString()
              }];
            });
          }
        })
        .catch(err => console.warn("Advisor: Sync delay", err));
    }
  }, [zipCode]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessage: ChatMessage = { 
      role: 'user', 
      content: userMessage, 
      timestamp: new Date().toISOString() 
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await processAdvisorQuery(userMessage, messages);
      
      setMessages(prev => [...prev, {
        role: 'ai',
        content: response.content || "Protocol ambiguity detected. Please refine query.",
        citations: response.citations,
        confidenceScore: response.confidenceScore,
        timestamp: response.timestamp || new Date().toISOString()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Institutional logic interrupted. Please verify connection and retry.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const messageList = useMemo(() => (
    messages.map((m, i) => (
      <MessageItem key={`${m.timestamp}-${i}`} message={m} />
    ))
  ), [messages]);

  return (
    <div id="advisor-chat-container" className="pro-card flex flex-col h-[500px] sm:h-[600px] overflow-hidden p-0 border border-surface-200" role="region" aria-label="AI Advisor">
      <div className="bg-ink-900 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-brand-blue" />
          <h3 className="font-bold text-sm uppercase tracking-wide">Civic Advisor</h3>
        </div>
        <div className="text-[10px] font-bold text-brand-blue uppercase bg-brand-blue/10 px-2 py-0.5 rounded border border-brand-blue/20">
          Grounded v2.0
        </div>
      </div>
      
      <div id="advisor-scroll-area" ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-surface-50 custom-scrollbar">
        {messageList}
        {isLoading && <LoadingMessage />}
      </div>

      <div className="p-4 bg-white border-t border-surface-100 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask analytical questions..."
          className="flex-1 bg-surface-50 border border-surface-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-blue/20"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-brand-blue text-white p-2.5 rounded-lg disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const MessageItem = React.memo<{ message: ChatMessage }>(({ message }) => (
  <motion.div 
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
  >
    <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
      message.role === 'user' ? 'bg-brand-blue text-white' : 'bg-white border border-surface-200 text-ink-800 shadow-sm'
    }`}>
      <div className="markdown-body">
        <Markdown>{message.content}</Markdown>
      </div>
    </div>
    {message.role === 'ai' && message.confidenceScore !== undefined && (
      <div className="mt-3 flex flex-col gap-2 w-full">
        <div className="flex items-center gap-3 px-1">
          <div className="text-[9px] font-bold text-ink-700/40 uppercase tracking-widest">
            Confidence: {message.confidenceScore}%
          </div>
          <div className="w-12 h-1 bg-surface-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand-blue" 
              initial={{ width: 0 }}
              animate={{ width: `${message.confidenceScore}%` }}
            />
          </div>
        </div>
        
        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-1">
            {message.citations.map((cite, idx) => (
              <div key={idx} className="bg-brand-blue/5 border border-brand-blue/10 rounded-lg p-2.5 flex items-center justify-between group transition-all hover:bg-brand-blue/10">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Search className="w-3 h-3 text-brand-blue shrink-0" />
                  <span className="text-[9px] font-bold text-brand-blue uppercase tracking-tight opacity-70 shrink-0">Source {idx + 1}:</span>
                  <div 
                    className="text-[10px] font-medium text-brand-blue truncate"
                    dangerouslySetInnerHTML={{ 
                      __html: cite.html?.replace(/<a /g, '<a rel="noopener noreferrer" target="_blank" class="underline hover:opacity-70 transition-opacity" ') || cite.title 
                    }} 
                  />
                </div>
                <ExternalLink className="w-2.5 h-2.5 text-brand-blue opacity-30 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </motion.div>
));

const LoadingMessage = () => (
  <div className="flex items-center gap-2 text-xs text-ink-700/50 italic">
    <Loader2 className="w-3 h-3 animate-spin" />
    Syncing institutional data...
  </div>
);

export default React.memo(ChatAssistant);
