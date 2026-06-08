'use client';

import React from 'react';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, Settings, BarChart3, Stethoscope, ShieldAlert } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { UserMenu } from '@/components/auth/user-menu';

interface DoctorLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/doctor/dashboard',
    icon: Home,
  },
  {
    name: 'Patients',
    href: '/doctor/dashboard/patients',
    icon: Users,
  },
  {
    name: 'Reports',
    href: '/doctor/dashboard/reports',
    icon: FileText,
  },
  {
    name: 'Flagged MRI',
    href: '/doctor/dashboard/flagged',
    icon: ShieldAlert,
  },
  {
    name: 'Analytics',
    href: '/doctor/dashboard/analytics',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    href: '/doctor/dashboard/settings',
    icon: Settings,
  },
];

export default function DoctorLayout({ children }: DoctorLayoutProps) {
  const pathname = usePathname();

  return (
    <ProtectedRoute requiredRole="doctor">
      <div className="doctor-theme flex h-screen bg-transparent">
        <aside className="w-64 bg-slate-100/95 text-slate-900 flex flex-col shadow-[0_10px_35px_rgba(15,23,42,0.08)] border-r border-slate-200/90 backdrop-blur-sm">
          <div className="p-6 border-b border-slate-200/90 bg-slate-100/85">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">CuraGenie</h1>
            <p className="text-sm text-slate-600 mt-1">Doctor Portal</p>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
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
                        <item.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-105" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-slate-200/90">
            <UserMenu />
          </div>
        </aside>
        
        <main className="flex-1 overflow-auto">
          <header className="bg-white/75 backdrop-blur-md border-b border-slate-200/90 px-8 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                {pathname === '/doctor/dashboard' ? 'Doctor Dashboard' : 
                 pathname === '/doctor/dashboard/patients' ? 'Patients' :
                 pathname === '/doctor/dashboard/reports' ? 'Reports' :
                  pathname === '/doctor/dashboard/flagged' ? 'Flagged MRI' :
                 pathname === '/doctor/dashboard/analytics' ? 'Analytics' :
                 pathname === '/doctor/dashboard/settings' ? 'Settings' : 'Dashboard'}
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
