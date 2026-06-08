'use client';

import React from 'react';
import { Chatbot } from '@/components/chatbot/chatbot';
import { Bot, Shield, Stethoscope } from 'lucide-react';

export default function ChatbotPage() {
  const userId = 'user123';

  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50 text-slate-900 rounded-2xl p-8 mb-8 overflow-hidden shadow-[0_16px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/90">
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-slate-100/60"></div>
        <div className="absolute top-0 right-0 w-36 h-36 bg-slate-300/30 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-slate-300/20 rounded-full translate-y-14 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Bot className="h-8 w-8 text-slate-700" />
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              AI Genomics Assistant
            </h1>
          </div>
          <p className="text-slate-700 text-xl max-w-2xl leading-relaxed">
            Chat with our AI assistant to understand your genomic analysis results and get educational information about your health data.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-slate-700 bg-white/75 rounded-full px-3 py-1 ring-1 ring-slate-300/80">
              <Shield className="h-4 w-4" />
              <span className="text-sm">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 bg-white/75 rounded-full px-3 py-1 ring-1 ring-slate-300/80">
              <Stethoscope className="h-4 w-4" />
              <span className="text-sm">Educational Only</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto">
        <Chatbot userId={userId} />
      </div>
    </div>
  );
}
