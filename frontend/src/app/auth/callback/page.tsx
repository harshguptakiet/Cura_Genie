'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/store/auth-store'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) throw error || new Error('No session found')

        const { user } = session

        // Exchange Supabase identity with backend to get app JWT
        const response = await fetch(`${API_BASE_URL}/api/auth/social-auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split('@')[0],
            provider: user.app_metadata?.provider || 'google',
            token: session.access_token,
            avatar_url: user.user_metadata?.avatar_url || '',
          }),
        })

        if (!response.ok) throw new Error('Failed to authenticate with backend')

        const data = await response.json()

        setToken(data.access_token)
        setUser({
          id: data.user_id,
          email: user.email!,
          username: user.email!.split('@')[0],
          role: data.role || 'patient',
          is_active: true,
          is_verified: true,
          created_at: new Date().toISOString(),
        })

        toast.success('Logged in successfully!')
        router.push('/dashboard')
      } catch (error) {
        console.error('OAuth callback error:', error)
        toast.error(error instanceof Error ? error.message : 'OAuth login failed. Please try again.')
        router.push('/auth/login')
      }
    }

    handleCallback()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-gray-600">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm">Completing sign in...</p>
      </div>
    </div>
  )
}