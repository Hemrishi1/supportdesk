import React, { useState } from 'react'
import { Sparkles, ArrowRight, X, RefreshCw, Plus, User } from 'lucide-react'

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ width: size, height: size, minWidth: size, minHeight: size, flexShrink: 0 }}
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

  // Google OAuth Modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showCustomGoogle, setShowCustomGoogle] = useState(false)
  const [customGoogleEmail, setCustomGoogleEmail] = useState('')

  const googleAccounts = [
    {
      name: 'Hemrishi',
      email: 'hemrishi@gmail.com',
      avatarColor: '#4285F4',
      initial: 'H'
    },
    {
      name: 'Hemrishi Support Admin',
      email: 'hemrishi.support@supportdesk.ai',
      avatarColor: '#34A853',
      initial: 'S'
    }
  ]

  const handleSelectGoogleAccount = (selectedEmail: string) => {
    setGoogleLoading(true)
    setTimeout(() => {
      setGoogleLoading(false)
      setShowGoogleModal(false)
      if (onSuccess) {
        onSuccess(selectedEmail)
      }
    }, 450)
  }

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customGoogleEmail.trim()) return
    handleSelectGoogleAccount(customGoogleEmail.trim())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (onSuccess) {
        onSuccess(email.trim() || 'demo.agent@supportdesk.ai')
      }
    }, 400)
  }

  return (
    <>
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
                        e.currentTarget.style.display = 'none'
                      }}
                    />
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

            {/* Google Sign-in Trigger Button */}
            <button
              type="button"
              id="google-signin-btn"
              onClick={() => setShowGoogleModal(true)}
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

      {/* Google OAuth Interactive Account Chooser Modal */}
      {showGoogleModal && (
        <div className="google-modal-overlay" onClick={() => !googleLoading && setShowGoogleModal(false)}>
          <div className="google-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="google-modal-header">
              <button
                className="google-modal-close"
                disabled={googleLoading}
                onClick={() => setShowGoogleModal(false)}
                title="Close"
              >
                <X size={18} />
              </button>
              <div className="google-modal-logo">
                <GoogleIcon size={32} />
              </div>
              <h3 className="google-modal-title">Sign in with Google</h3>
              <p className="google-modal-subtitle">
                Choose an account to continue to <strong>{companyName}</strong>
              </p>
            </div>

            {googleLoading ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <RefreshCw className="animate-spin" size={32} style={{ color: '#4285F4', margin: '0 auto 16px auto' }} />
                <p style={{ fontSize: '0.94rem', color: '#f8fafc', fontWeight: 600 }}>Verifying with Google…</p>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Synchronizing your workspace permissions</p>
              </div>
            ) : (
              <>
                <div className="google-account-list">
                  {googleAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      className="google-account-item"
                      onClick={() => handleSelectGoogleAccount(acc.email)}
                    >
                      <div
                        className="google-account-avatar"
                        style={{ backgroundColor: acc.avatarColor }}
                      >
                        {acc.initial}
                      </div>
                      <div className="google-account-info">
                        <span className="google-account-name">{acc.name}</span>
                        <span className="google-account-email">{acc.email}</span>
                      </div>
                    </button>
                  ))}

                  {/* Use another account option */}
                  {!showCustomGoogle && (
                    <button
                      type="button"
                      className="google-account-item"
                      onClick={() => setShowCustomGoogle(true)}
                    >
                      <div
                        className="google-account-avatar"
                        style={{ backgroundColor: '#1e293b', border: '1px dashed #64748b' }}
                      >
                        <User size={18} color="#cbd5e1" />
                      </div>
                      <div className="google-account-info">
                        <span className="google-account-name">Use another Google account</span>
                        <span className="google-account-email">Sign in with a different email address</span>
                      </div>
                    </button>
                  )}
                </div>

                {/* Custom Google Email Input Form */}
                {showCustomGoogle && (
                  <form onSubmit={handleCustomGoogleSubmit} className="google-modal-custom-form">
                    <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
                      Enter your Google email
                    </label>
                    <input
                      type="email"
                      placeholder="name@gmail.com or company Google Workspace"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      required
                      autoFocus
                      className="signin-input"
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                        onClick={() => setShowCustomGoogle(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ flex: 1, background: '#4285F4', borderColor: '#4285F4' }}
                      >
                        Next
                      </button>
                    </div>
                  </form>
                )}

                <div className="google-modal-footer">
                  To continue, Google will share your name, email address, and profile picture with {companyName}. Before using this app, review their <a href="#" style={{ color: '#818cf8' }}>Privacy Policy</a> and <a href="#" style={{ color: '#818cf8' }}>Terms of Service</a>.
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default SignIn6
