'use client';

import React from 'react';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, FileText, Stethoscope, Settings, Users, Timeline, Bot, Shield, HelpCircle, UserCircle, BrainCircuit } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { UserMenu } from '@/components/auth/user-menu';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Genomic Analysis',
    href: '/dashboard/visualizations',
    icon: BarChart3,
  },
  {
    name: 'AI Health Assistant',
    href: '/dashboard/chatbot',
    icon: Bot,
  },
  {
    name: 'Health Reports',
    href: '/dashboard/reports',
    icon: FileText,
  },
  {
    name: 'MRI Pipeline',
    href: '/dashboard/mri',
    icon: BrainCircuit,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings/consent',
    icon: Settings,
  },
  {
    name: 'Privacy Policy',
    href: '/dashboard/privacy-policy',
    icon: Shield,
  },
  {
  name: 'Profile',
  href: '/dashboard/profile',
  icon: UserCircle,
},
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <ProtectedRoute requiredRole="patient">
      <div className="dashboard-theme flex h-screen bg-transparent">
        <aside className="w-64 bg-slate-100/95 text-slate-900 flex flex-col shadow-[0_10px_35px_rgba(15,23,42,0.08)] border-r border-slate-200/90 backdrop-blur-sm">
          <div className="p-6 border-b border-slate-200/90 bg-slate-100/85">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-md ring-1 ring-slate-300/60">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">CuraGenie</h1>
                <p className="text-xs text-slate-600 font-medium">AI Genomics Platform</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-slate-800 text-white shadow-md ring-1 ring-slate-400/40'
                          : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      <item.icon className={`h-5 w-5 transition-transform duration-200 ${
                        isActive ? 'text-slate-100' : 'group-hover:scale-105'
                      }`} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
        
        <main className="flex-1 overflow-auto">
          <header className="bg-white/72 backdrop-blur-md border-b border-slate-200/70 px-8 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                {pathname === '/dashboard' ? 'Dashboard' : 
                 pathname === '/dashboard/visualizations' ? 'Genomic Analysis' :
                 pathname === '/dashboard/chatbot' ? 'AI Health Assistant' :
                 pathname === '/dashboard/reports' ? 'Health Reports' :
                  pathname === '/dashboard/mri' ? 'MRI Pipeline' :
                 pathname === '/dashboard/privacy-policy' ? 'Privacy Policy' :
                 pathname.includes('/dashboard/settings') ? 'Settings' :
                 pathname === '/dashboard/profile' ? 'My Profile' : 'Dashboard'}
              </h2>
              <UserMenu />
            </div>
          </header>
          
          <div className="p-8 animate-slide-up">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

