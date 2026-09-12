import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  Inbox,
  Clock,
  LogIn,
  Cpu
} from 'lucide-react';

export default function HomePage({ onGoToSignIn, onQuickDemo, activeModel = 'gpt-5.6-luna' }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', overflowX: 'hidden' }}>
      {/* Top Navbar */}
      <header style={{
        height: '76px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={20} />
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-display, sans-serif)', letterSpacing: '-0.5px' }}>
            SupportDesk
          </span>
          <span style={{
            fontSize: '0.65rem',
            background: 'rgba(99, 102, 241, 0.18)',
            color: '#a5b4fc',
            padding: '2px 8px',
            borderRadius: '9999px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            fontWeight: 700
          }}>
            AI PILOT
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: '#34d399',
            fontSize: '0.8rem',
            fontWeight: 600
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <span>AI Ready ({activeModel})</span>
          </div>

          <button
            onClick={onQuickDemo}
            className="btn btn-secondary"
            style={{ fontSize: '0.86rem', padding: '8px 16px' }}
          >
            <span>Explore Demo</span>
          </button>

          <button
            onClick={onGoToSignIn}
            className="btn btn-primary"
            style={{ fontSize: '0.86rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '80px 24px 60px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Ambient Glow */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '250px',
          background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 80%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#c7d2fe',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: '24px'
          }}>
            <Sparkles size={14} color="#818cf8" />
            <span>Next-Gen Customer Support AI</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            maxWidth: '920px',
            margin: '0 auto 24px auto',
            color: '#ffffff'
          }}>
            Turn complex support requests into thoughtful replies{' '}
            <span style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              in seconds.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: '#94a3b8',
            maxWidth: '680px',
            margin: '0 auto 36px auto',
            lineHeight: 1.6
          }}>
            Policy-aware triage, instant priority classification, and automated reply drafting — powered by Google Gemini and Experiential Labs, keeping your team in full control.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={onGoToSignIn}
              className="btn btn-primary"
              style={{
                fontSize: '1rem',
                padding: '14px 28px',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
              }}
            >
              <span>Sign in to Workspace</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onQuickDemo}
              className="btn btn-secondary"
              style={{
                fontSize: '1rem',
                padding: '14px 24px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)'
              }}
            >
              <span>Try Instant Pilot</span>
            </button>
          </div>
        </div>

        {/* Interactive Preview Mockup Card */}
        <div style={{
          marginTop: '64px',
          background: 'linear-gradient(145deg, rgba(26, 38, 66, 0.8), rgba(15, 23, 42, 0.95))',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
          textAlign: 'left',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f43f5e' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span style={{ marginLeft: '12px', fontSize: '0.82rem', color: '#64748b', fontFamily: 'monospace' }}>
                SupportDesk Triage Stream · Live Agent Simulator
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="tag tag-category">Billing</span>
              <span className="tag tag-priority-high">Priority: High</span>
              <span className="tag tag-status-approved">Approved Draft</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* Incoming Ticket Preview */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '14px',
              padding: '18px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                Customer Request #1042
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '6px' }}>
                Charged twice for monthly subscription
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                "Hi, I noticed two charges for my subscription on my latest statement. Could you check what happened and refund the duplicate payment? My invoice ref is INV-1042."
              </p>
            </div>

            {/* AI Policy-Aware Draft Preview */}
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              borderRadius: '14px',
              padding: '18px',
              border: '1px solid rgba(99, 102, 241, 0.25)'
            }}>
              <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                ✦ AI Draft (Verified Policy Interpretation)
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '6px', color: '#e0e7ff' }}>
                Ready for Review & Dispatch
              </div>
              <p style={{ fontSize: '0.85rem', color: '#c7d2fe', lineHeight: 1.5 }}>
                "Hi Maya, thank you for reaching out. We have received your query regarding invoice INV-1042. As per our billing policy, our accounts team will verify the duplicate transaction..."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section style={{
        padding: '60px 24px 100px 24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display, sans-serif)', marginBottom: '12px' }}>
            Engineered for Modern Support Operations
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Built with zero unnecessary dependencies, private local database storage, and multi-model flexibility.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <Zap size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
              Instant Multi-Factor Triage
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Automatically categorizes incoming messages into Billing, Technical, Account, or General with low-to-urgent priority weighting.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
              Policy-Aware Safeguards
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>
              AI strictly adheres to your configured company rules and FAQs. Never hallucinates false refund promises or commitments.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <CheckCircle2 size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
              Human-in-the-Loop Review
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Every draft is editable. Human operators approve, adjust, or escalate with single-click actions and full audit history.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <Cpu size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
              Multi-Provider Architecture
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Route LLM requests through Google Gemini, Experiential Labs (gpt-5.6-luna), or OpenAI via standard environment keys.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section style={{
        padding: '60px 24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 23, 42, 0.6)',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px', fontFamily: 'var(--font-display, sans-serif)' }}>
          Ready to experience automated triage?
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
          Sign in to your SupportDesk workspace to view your live tickets and triage queue.
        </p>
        <button
          onClick={onGoToSignIn}
          className="btn btn-primary"
          style={{ fontSize: '0.95rem', padding: '12px 28px', borderRadius: '10px' }}
        >
          <LogIn size={16} />
          <span>Access Workspace</span>
        </button>
      </section>

      {/* Simple Footer */}
      <footer style={{
        padding: '24px 32px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        color: '#64748b',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <span>SupportDesk Pilot · Local High-Security Workspace</span>
        <span>Human-in-the-loop customer support intelligence</span>
      </footer>
    </div>
  );
}
