import React, { useState } from 'react'
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }}
      aria-hidden="true"
    >
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
      if (onSuccess) onSuccess(email || 'demo.agent@supportdesk.ai')
    }, 600)
  }

  if (signedIn) {
    return (
      <div className="signin-success-card">
        <div className="signin-success-icon">
          <ShieldCheck style={{ width: 30, height: 30 }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
          Welcome to {companyName}
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '24px', lineHeight: 1.5 }}>
          Authenticated successfully. Your workspace is synchronized.
        </p>
        <button
          onClick={() => setSignedIn(false)}
          className="signin-submit-btn"
        >
          Manage Workspace
        </button>
      </div>
    )
  }

  return (
    <div className="signin-container">
      <div className="signin-card">
        {/* Left Branding Hero with Website's Indigo Theme */}
        <div className="signin-hero">
          {/* Ambient Glowing Orbs */}
          <div className="signin-hero-glow-1" />
          <div className="signin-hero-glow-2" />

          {/* Brand Header */}
          <div className="signin-brand-header">
            <div className="signin-brand-icon">
              <Sparkles style={{ width: 20, height: 20, color: '#ffffff' }} />
            </div>
            <span className="signin-brand-name">{companyName}</span>
            <span className="signin-brand-tag">AI Triage</span>
          </div>

          {/* Headline Quote */}
          <div className="signin-hero-body">
            <h2 className="signin-hero-title">
              Where customer support teams triage, draft, and resolve together.
            </h2>
            <p className="signin-hero-desc">
              Automate first drafts with policy awareness while keeping human review at the center.
            </p>
          </div>

          {/* Social Proof */}
          <div className="signin-hero-proof">
            <div className="signin-avatar-group">
              {proof.map((p) => (
                <div key={p.initials} className="signin-avatar-item" title={p.initials}>
                  <img
                    src={p.src}
                    alt={p.initials}
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => {
                      // Fallback if image blocked
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <span className="signin-avatar-fallback" style={{ display: 'none' }}>
                    {p.initials}
                  </span>
                </div>
              ))}
            </div>
            <span className="signin-proof-text">
              Used by 40,000+ support specialists
            </span>
          </div>
        </div>

        {/* Right Login Form matching website dark theme */}
        <div className="signin-form-pane">
          <div className="signin-header-box">
            <h1 className="signin-title">Welcome back</h1>
            <p className="signin-subtitle">
              Sign in to your {companyName} agent workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEmail('google.agent@supportdesk.ai')
              handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            }}
            className="signin-google-btn"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <div className="signin-divider">
            <div className="signin-divider-line" />
            <span className="signin-divider-text">or email</span>
            <div className="signin-divider-line" />
          </div>

          <form onSubmit={handleSubmit} className="signin-form">
            <div className="signin-field">
              <label htmlFor="ss-email" className="signin-label">
                Work Email
              </label>
              <div className="signin-input-wrapper">
                <input
                  id="ss-email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="signin-input"
                />
              </div>
            </div>

            <div className="signin-field">
              <div className="signin-label-row">
                <label htmlFor="ss-password" className="signin-label">
                  Password
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Password reset link sent to your registered work email.')
                  }}
                  className="signin-forgot-link"
                >
                  Forgot?
                </a>
              </div>
              <div className="signin-input-wrapper">
                <input
                  id="ss-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="signin-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="signin-submit-btn"
            >
              {loading ? (
                <span>Authenticating…</span>
              ) : (
                <>
                  <span>Sign in to Workspace</span>
                  <ArrowRight style={{ width: 16, height: 16, flexShrink: 0 }} />
                </>
              )}
            </button>
          </form>

          <p className="signin-footer-text">
            No account yet?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                alert('Free pilot activated for this workspace session!')
              }}
              className="signin-footer-link"
            >
              Start free pilot
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn6
