import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  )
}

const proof = [
  {
    initials: 'JD',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  {
    initials: 'MK',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    initials: 'AR',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  },
]

export interface SignIn6Props {
  onSuccess?: (email: string) => void;
  companyName?: string;
}

export function SignIn6({ onSuccess, companyName = 'SupportDesk' }: SignIn6Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSignedIn(true)
      if (onSuccess) onSuccess(email || 'demo@supportdesk.ai')
    }, 600)
  }

  if (signedIn) {
    return (
      <Card className="w-full max-w-md p-8 text-center bg-[#131b2e] border-[rgba(255,255,255,0.1)] text-[#f8fafc] shadow-2xl rounded-2xl mx-auto">
        <div className="w-14 h-14 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-lg">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold mb-2">Welcome to {companyName}</h3>
        <p className="text-sm text-[#94a3b8] mb-6">
          Authenticated successfully. Your workspace is synchronized.
        </p>
        <Button
          onClick={() => setSignedIn(false)}
          className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium py-2.5 rounded-lg transition-all"
        >
          Manage Workspace
        </Button>
      </Card>
    )
  }

  return (
    <Card className="grid w-full gap-0 p-0 md:grid-cols-2 overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#131b2e] shadow-2xl rounded-2xl">
      {/* Left Branding Hero with Website's Indigo Gradient Theme */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#312e81] p-10 text-white md:flex">
        {/* Ambient Glowing Orbs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-indigo-300/10 blur-2xl" />

        {/* Brand Header */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/25 shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight">{companyName}</span>
          <span className="text-[10px] font-semibold bg-white/20 text-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
            AI Triage
          </span>
        </div>

        {/* Headline Quote */}
        <div className="relative my-auto py-10">
          <h2 className="text-[28px] font-bold leading-[1.2] tracking-tight text-balance text-white">
            Where customer support teams triage, draft, and resolve together.
          </h2>
          <p className="mt-3 text-sm text-indigo-100/80 leading-relaxed max-w-[34ch]">
            Automate first drafts with policy awareness while keeping human review at the center.
          </p>
        </div>

        {/* Social Proof */}
        <div className="relative flex items-center gap-3 pt-6 border-t border-white/15">
          <div className="flex -space-x-2.5">
            {proof.map((p) => (
              <Avatar
                key={p.initials}
                className="h-8 w-8 ring-2 ring-indigo-300/40 rounded-full overflow-hidden"
              >
                <AvatarImage src={p.src} alt="" className="object-cover h-full w-full" />
                <AvatarFallback className="bg-indigo-950 text-indigo-200 text-[10px] font-bold">
                  {p.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-xs text-indigo-100/90 font-medium">
            Used by 40,000+ support specialists
          </span>
        </div>
      </div>

      {/* Right Login Form matching website dark theme */}
      <div className="flex flex-col justify-center gap-5 p-8 md:p-10 bg-[#0e1424] text-[#f8fafc]">
        <div className="flex flex-col gap-1.5">
          <span className="text-2xl font-bold tracking-tight font-display text-white">Welcome back</span>
          <span className="text-xs text-[#94a3b8]">
            Sign in to your {companyName} agent workspace.
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setEmail('google.user@example.com')
            handleSubmit({ preventDefault: () => {} } as React.FormEvent)
          }}
          className="w-full justify-center gap-2.5 bg-[#131b2e] hover:bg-[#1a243d] border-[rgba(255,255,255,0.12)] text-[#f8fafc] font-medium py-2.5 rounded-lg transition-all"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </Button>

        <div className="flex items-center gap-3 my-1">
          <span className="bg-[rgba(255,255,255,0.08)] h-px flex-1" />
          <span className="text-[#64748b] text-[11px] font-semibold uppercase tracking-wider">
            or email
          </span>
          <span className="bg-[rgba(255,255,255,0.08)] h-px flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ss-email" className="text-xs font-semibold text-[#cbd5e1]">
              Work Email
            </Label>
            <Input
              id="ss-email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#0b1120] border-[rgba(255,255,255,0.12)] text-white placeholder:text-[#64748b] focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] rounded-lg h-10 px-3.5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="ss-password" className="text-xs font-semibold text-[#cbd5e1]">
                Password
              </Label>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered email.') }}
                className="text-xs text-[#818cf8] hover:text-[#a5b4fc] transition-colors"
              >
                Forgot?
              </a>
            </div>
            <Input
              id="ss-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#0b1120] border-[rgba(255,255,255,0.12)] text-white placeholder:text-[#64748b] focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] rounded-lg h-10 px-3.5"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#4f46e5] hover:to-[#4338ca] text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating…</span>
            ) : (
              <>
                <span>Sign in to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-[#94a3b8] text-center text-xs mt-1">
          No account yet?{' '}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); alert('Free trial activated for this workspace.') }}
            className="text-[#818cf8] font-semibold hover:underline"
          >
            Start free pilot
          </a>
        </p>
      </div>
    </Card>
  )
}

export default SignIn6;
