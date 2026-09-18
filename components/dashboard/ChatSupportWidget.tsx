'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  X,
  Send,
  ExternalLink,
  Bot,
  CheckCheck,
  Headphones,
} from 'lucide-react';
import { ChatMessage, DeliveryOrder } from '@/types/delivery';
import { initialChatMessages, cannedFaqs } from '@/lib/mockData';

interface ChatSupportWidgetProps {
  activeOrder?: DeliveryOrder;
  isOpen: boolean;
  onToggle: () => void;
  initialMessagePrompt?: string;
}

export default function ChatSupportWidget({
  activeOrder,
  isOpen,
  onToggle,
  initialMessagePrompt,
}: ChatSupportWidgetProps) {
  const [activeSupportTab, setActiveSupportTab] = useState<'whatsapp' | 'livechat'>('livechat');
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const whatsappNumber = '2348034567890';
  const orderRef = activeOrder ? `Waybill #${activeOrder.trackingNumber || activeOrder.id}` : 'my shipments';
  const prefilledWhatsappText = encodeURIComponent(
    `Hello Swift Logistics Support! I need concierge assistance regarding ${orderRef}.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefilledWhatsappText}`;

  const sendMessage = useCallback((textToSend: string) => {
    const clean = textToSend.trim();
    if (!clean) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: clean,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "Thank you for reaching Swift Logistics. Our dispatch operations are actively monitoring your cargo.";
      const lower = clean.toLowerCase();

      if (lower.includes('where') || lower.includes('status') || lower.includes('driver')) {
        if (activeOrder) {
          botResponse = `Consignment ${activeOrder.trackingNumber || activeOrder.id} is currently "${activeOrder.status.replace('_', ' ').toUpperCase()}". Assigned courier ${activeOrder.driver?.name || 'Babajide Sanusi'} (${activeOrder.driver?.vehiclePlate || 'LAG-492-APP'}) is approaching with estimated arrival around ${activeOrder.estimatedDelivery}.`;
        } else {
          botResponse = 'All your active shipments across Lagos, Abuja, Port Harcourt & Kano are on schedule! View the live telemetry track right on your dashboard.';
        }
      } else if (lower.includes('address') || lower.includes('change')) {
        botResponse = 'To redirect your destination hub or update your gate pass instructions while the courier is en route, please contact support directly via WhatsApp or call our 24/7 hotline (+234 800 794 3853).';
      } else if (lower.includes('receipt') || lower.includes('invoice') || lower.includes('tax')) {
        botResponse = 'Official Nigerian FIRS Tax Invoices and stamped receipts are generated instantly! Click the "Official Tax Receipt PDF" button on your tracking card or in the waybills archive.';
      } else if (lower.includes('claim') || lower.includes('insurance') || lower.includes('damage')) {
        botResponse = 'All priority shipments are covered under our ₦2,500,000 Transit Indemnity Guarantee. To submit a claim, please quote your waybill number to claims@swiftlogistics.ng.';
      } else {
        botResponse = `Understood! A dispatch officer has been alerted regarding ${orderRef}. You can also switch to the WhatsApp tab for instant live concierge response.`;
      }

      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: botResponse,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 800);
  }, [activeOrder, orderRef]);

  useEffect(() => {
    if (initialMessagePrompt) {
      const timer = setTimeout(() => {
        sendMessage(initialMessagePrompt);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialMessagePrompt, sendMessage]);

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 flex flex-col items-end max-w-[calc(100vw-1.5rem)] pointer-events-auto">
      {/* Expanded Support Card */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-1.5rem)] sm:w-[390px] max-w-[390px] bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[75vh] max-h-[520px] text-slate-100 animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-[#0c1322] border-b border-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">
                  Swift Concierge Support
                </h4>
                <p className="text-[10px] text-emerald-400 font-medium">24/7 Nationwide Response</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggle}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-slate-800 bg-slate-900/90 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveSupportTab('livechat')}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-colors ${
                activeSupportTab === 'livechat'
                  ? 'text-emerald-400 border-b-2 border-emerald-500 bg-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>In-App Chat</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSupportTab('whatsapp')}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-colors ${
                activeSupportTab === 'whatsapp'
                  ? 'text-emerald-400 border-b-2 border-emerald-500 bg-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-current text-emerald-400" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
              </svg>
              <span>WhatsApp Direct</span>
            </button>
          </div>

          {/* TAB 1: WHATSAPP DIRECT */}
          {activeSupportTab === 'whatsapp' && (
            <div className="flex-1 p-5 flex flex-col justify-between space-y-4 bg-slate-950/70 text-center">
              <div className="space-y-3 my-auto">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                  </svg>
                </div>

                <h4 className="text-base font-bold text-white">Chat on WhatsApp</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[260px] mx-auto">
                  Instant real-time connection with our designated Lagos & Abuja logistics dispatch desk.
                </p>

                {activeOrder && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Target Waybill:</span>
                    <div className="font-mono text-emerald-400 font-bold">{activeOrder.trackingNumber || activeOrder.id}</div>
                    <div className="text-slate-400 text-[11px] truncate">
                      {activeOrder.sender.city} &rarr; {activeOrder.receiver.city}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                  </svg>
                  <span>Open WhatsApp (+234 803 456 7890)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: IN-APP LIVE CHAT */}
          {activeSupportTab === 'livechat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-950/60">
              {/* Message Feed */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 text-xs">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] p-3 rounded-2xl ${
                          isUser
                            ? 'bg-emerald-500 text-black font-medium'
                            : 'bg-slate-900 border border-slate-800 text-slate-200'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        <div
                          className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${
                            isUser ? 'text-black/60 font-semibold' : 'text-slate-500'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {isUser && <CheckCheck className="w-3 h-3 text-black" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center">
                      <Bot className="w-3 h-3" />
                    </div>
                    <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-400">
                      Concierge typing...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-900/80 overflow-x-auto flex gap-1.5">
                {cannedFaqs.map((faq, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(faq)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700/60 text-[10px] text-slate-300 hover:text-white shrink-0 transition-colors"
                  >
                    {faq}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(inputText);
                }}
                className="p-2.5 border-t border-slate-800 bg-[#0c1322] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask concierge about your delivery..."
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black flex items-center justify-center transition-all shadow-md active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={onToggle}
        id="chat-support-floating-btn"
        className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 sm:gap-2 shadow-xl shadow-emerald-500/25 active:scale-95 transition-all font-bold text-xs shrink-0"
      >
        <MessageSquare className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline">Concierge / WhatsApp</span>
        <span className="sm:hidden">Support</span>
      </button>
    </div>
  );
}
