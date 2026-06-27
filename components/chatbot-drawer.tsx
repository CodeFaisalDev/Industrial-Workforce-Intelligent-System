'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Send, Terminal, User, Sparkles, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id?: number;
  message: string;
  role: 'user' | 'assistant';
  timestamp?: string;
}

interface ChatbotDrawerProps {
  role: string;
}

export default function ChatbotDrawer({ role }: ChatbotDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Map system role to seeded database Employee ID
  const getUserIdByRole = () => {
    if (role === 'HR Admin') return 1; // Prithula
    if (role === 'Floor Manager') return 2; // Nazmul Hasan
    return 3; // Faria Sultana (Worker)
  };

  const activeUserId = getUserIdByRole();

  // Load chat history on mount or role swap
  const loadHistory = async () => {
    try {
      const res = await fetch(`/api/chatbot?user_id=${activeUserId}`);
      const data = await res.json();
      if (data.success && data.history?.length > 0) {
        setMessages(data.history);
      } else {
        // Welcome message if no history
        const name = role === 'HR Admin' ? 'Prithula' : role === 'Floor Manager' ? 'Nazmul' : 'Faria';
        setMessages([
          {
            role: 'assistant',
            message: `Hello ${name}! I am your AI Operations Assistant. You can ask me details about your shifts, latest payslip details, or check factory policies. How can I assist you today?`,
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [role]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', message: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          user_id: activeUserId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', message: data.reply }]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', message: 'I encountered an error. Please report this to Nazmul or Prithula.' },
        ]);
      }
    } catch (error) {
      console.error('Failed to query chatbot:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', message: 'Offline alert: Could not contact chatbot services.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getActiveUserInitials = () => {
    if (role === 'HR Admin') return 'PR';
    if (role === 'Floor Manager') return 'NH';
    return 'FS';
  };

  return (
    <SheetContent className="w-full sm:max-w-[450px] flex flex-col h-full p-0 gap-0 border-l border-border">
      {/* Header */}
      <SheetHeader className="p-6 border-b border-border bg-card/65 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
            <Sparkles size={16} className="animate-pulse" />
          </div>
          <div className="text-left">
            <SheetTitle className="text-sm font-bold">AI Operations Assistant</SheetTitle>
            <SheetDescription className="text-[10px] text-muted-foreground font-mono">
              Grounded on factory policy documents & your data
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-secondary/10">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div key={index} className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <Avatar className="h-7 w-7 rounded-lg shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                    : 'bg-card border border-border text-foreground rounded-tl-none shadow-sm'
                }`}
              >
                {msg.message}
              </div>
              {isUser && (
                <Avatar className="h-7 w-7 rounded-lg shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                    {getActiveUserInitials()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}

        {/* Loading Typing Indicator */}
        {loading && (
          <div className="flex items-start gap-3 justify-start">
            <Avatar className="h-7 w-7 rounded-lg shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                AI
              </AvatarFallback>
            </Avatar>
            <div className="bg-card border border-border text-muted-foreground rounded-xl p-3 text-xs font-mono font-semibold rounded-tl-none shadow-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Form */}
      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about leave policies, your shifts, or pay..."
            className="text-xs h-9 bg-secondary/20 border-border/80 focus-visible:ring-primary"
            disabled={loading}
            required
          />
          <Button type="submit" size="icon" className="h-9 w-9 shrink-0 rounded-lg" disabled={loading}>
            <Send size={14} />
          </Button>
        </form>
      </div>
    </SheetContent>
  );
}
