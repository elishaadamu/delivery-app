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
  const orderRef = activeOrder ? `Order #${activeOrder.trackingNumber}` : 'my shipments';
  const prefilledWhatsappText = encodeURIComponent(
    `Hello SwiftDrop Support! I need assistance regarding ${orderRef}.`
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
      let botResponse = "Thanks for reaching out! Our dispatch team is monitoring your delivery.";
      const lower = clean.toLowerCase();

      if (lower.includes('where') || lower.includes('status') || lower.includes('driver')) {
        if (activeOrder) {
          botResponse = `Order ${activeOrder.trackingNumber} is currently "${activeOrder.status.replace('_', ' ').toUpperCase()}". Your courier ${activeOrder.driver?.name || 'Babajide'} is scheduled to arrive around ${activeOrder.estimatedDelivery}.`;
        } else {
          botResponse = 'All your active deliveries are on schedule! You can view the live status right on your dashboard.';
        }
      } else if (lower.includes('address') || lower.includes('change')) {
        botResponse = 'To modify your delivery address while the courier is en route, please contact support via the WhatsApp tab or call the driver directly.';
      } else if (lower.includes('proof') || lower.includes('receipt')) {
        botResponse = 'Digital receipts and signature records are available once an order reaches the "Delivered" state. You can download the PDF receipt directly from your Orders History table.';
      } else {
        botResponse = `Understood! An agent has been alerted regarding ${orderRef}. You can also connect via WhatsApp for immediate live agent assistance.`;
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
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      
      {/* Expanded Support Card */}
      {isOpen && (
        <div className="mb-3 w-[350px] sm:w-[380px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col h-[500px] text-gray-900">
          
          {/* Header */}
          <div className="p-3.5 bg-blue-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center">
                <Headphones className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">
                  SwiftDrop Support
                </h4>
                <p className="text-[11px] text-blue-100">Live Courier Assistance</p>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="w-7 h-7 rounded text-white/80 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-semibold">
            <button
              onClick={() => setActiveSupportTab('livechat')}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeSupportTab === 'livechat'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Live Chat</span>
            </button>

            <button
              onClick={() => setActiveSupportTab('whatsapp')}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeSupportTab === 'whatsapp'
                  ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-current text-emerald-600" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
              </svg>
              <span>WhatsApp Direct</span>
            </button>
          </div>

          {/* TAB 1: WHATSAPP DIRECT */}
          {activeSupportTab === 'whatsapp' && (
            <div className="flex-1 p-5 flex flex-col justify-between space-y-4 bg-white text-center">
              <div className="space-y-3 my-auto">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                  </svg>
                </div>

                <h4 className="text-sm font-bold text-gray-900">Chat on WhatsApp</h4>
                <p className="text-xs text-gray-600 leading-relaxed max-w-[260px] mx-auto">
                  Direct connection with our logistics support team.
                </p>

                {activeOrder && (
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-left text-xs space-y-0.5">
                    <span className="text-[10px] text-gray-500 font-semibold uppercase">Active Delivery:</span>
                    <div className="font-mono text-gray-900 font-semibold">{activeOrder.trackingNumber}</div>
                    <div className="text-gray-600 text-[11px] truncate">
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
                  className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                  </svg>
                  <span>Open WhatsApp (+234 803 456 7890)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: IN-APP LIVE CHAT */}
          {activeSupportTab === 'livechat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white">
              
              {/* Message Feed */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] p-2.5 rounded-lg ${
                          isUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        <div
                          className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${
                            isUser ? 'text-blue-100' : 'text-gray-400'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {isUser && <CheckCheck className="w-3 h-3 text-blue-100" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                      <Bot className="w-3 h-3" />
                    </div>
                    <div className="bg-gray-100 px-2.5 py-1.5 rounded-lg text-gray-500">
                      Typing...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 overflow-x-auto flex gap-1.5">
                {cannedFaqs.map((faq, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(faq)}
                    className="px-2 py-1 rounded bg-white hover:bg-gray-100 border border-gray-200 text-[10px] text-gray-700 shrink-0 transition-colors cursor-pointer"
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
                className="p-2 border-t border-gray-200 bg-white flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-7 h-7 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer"
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
        onClick={onToggle}
        id="chat-support-floating-btn"
        className="px-3.5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="text-xs font-semibold">Chat Support / WhatsApp</span>
      </button>

    </div>
  );
}
