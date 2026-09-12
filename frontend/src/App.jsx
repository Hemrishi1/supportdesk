import React, { useState, useEffect } from 'react';
import {
  Inbox,
  FileText,
  Clock,
  BarChart3,
  Plus,
  Download,
  RefreshCw,
  Search,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  X,
  Copy,
  ChevronRight,
  Send,
  Zap,
  Check,
  AlertTriangle,
  Flame,
  Layers,
  HelpCircle,
  Settings,
  Building,
  LogIn
} from 'lucide-react';

import StackSpreadDemo from "@/components/ui/demo";
import SignIn6 from "@/components/ui/sign-in-6";

export default function App() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inbox');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reviewDraft, setReviewDraft] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  // Policy Form
  const [companyName, setCompanyName] = useState('');
  const [policyText, setPolicyText] = useState('');
  const [isSavingPolicy, setIsSavingPolicy] = useState(false);

  // New Request Form
  const [formData, setFormData] = useState({
    customer: '',
    subject: '',
    message: '',
    mode: 'live'
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const fetchState = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/state');
      if (!res.ok) throw new Error('Failed to fetch state');
      const data = await res.json();
      setState(data);
      setCompanyName(data.settings?.company || 'Your company');
      setPolicyText(data.settings?.policy || '');
      if (!data.live_available && formData.mode === 'live') {
        setFormData((prev) => ({ ...prev, mode: 'demo' }));
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer.trim() || !formData.subject.trim() || !formData.message.trim()) {
      addToast('Please fill out all fields.', 'error');
      return;
    }
    setIsCreating(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Token': state.token
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create request');
      
      addToast('AI Draft generated successfully!', 'success');
      setIsCreateOpen(false);
      setFormData({ customer: '', subject: '', message: '', mode: state.live_available ? 'live' : 'demo' });
      await fetchState(true);

      // Open review dialog for the newly created ticket
      const freshRes = await fetch('/api/state');
      const freshData = await freshRes.json();
      const created = freshData.tickets.find((t) => t.id === data.id);
      if (created) {
        setSelectedTicket(created);
        setReviewDraft(created.draft);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleReviewAction = async (status) => {
    if (!selectedTicket) return;
    setIsReviewing(true);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Token': state.token
        },
        body: JSON.stringify({
          id: selectedTicket.id,
          draft: reviewDraft,
          status
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update review');

      const msg =
        status === 'Approved'
          ? 'Draft approved and saved. Ready for dispatch!'
          : status === 'Escalated'
          ? 'Request marked as Escalated.'
          : 'Draft saved for review.';
      addToast(msg, 'success');
      setSelectedTicket(null);
      await fetchState(true);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsReviewing(false);
    }
  };

  const handleSavePolicy = async (e) => {
    e.preventDefault();
    setIsSavingPolicy(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Token': state.token
        },
        body: JSON.stringify({
          company: companyName,
          policy: policyText
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save knowledge');

      addToast('Company knowledge & policies saved.', 'success');
      await fetchState(true);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSavingPolicy(false);
    }
  };

  const handleCopyDraft = async () => {
    try {
      await navigator.clipboard.writeText(reviewDraft);
      addToast('Draft copied to clipboard!', 'success');
    } catch {
      addToast('Unable to copy automatically.', 'error');
    }
  };

  const handleSampleClick = () => {
    setFormData({
      customer: 'Maya Patel',
      subject: 'Charged twice for monthly subscription',
      message:
        'Hi, I noticed two charges for my subscription on my latest card statement. Could you check what happened and let me know if I can get the duplicate payment refunded? My invoice reference is INV-1042. Thank you!',
      mode: state?.live_available ? 'live' : 'demo'
    });
  };

  const handleExportCSV = () => {
    if (!state?.tickets?.length) {
      addToast('No requests available to export.', 'info');
      return;
    }
    const fields = ['id', 'customer', 'subject', 'message', 'category', 'priority', 'status', 'mode', 'draft', 'created'];
    const cell = (s) => '"' + String(s ?? '').replace(/^[\s]*[=+@-]/, (m) => "'" + m).replace(/"/g, '""') + '"';
    const csv = [
      fields.map(cell).join(','),
      ...state.tickets.map((t) => fields.map((f) => cell(t[f])).join(','))
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `supportdesk-export-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    addToast('CSV export downloaded.', 'success');
  };

  if (loading && !state) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#090d16', color: '#94a3b8' }}>
        <RefreshCw className="animate-spin" size={32} style={{ color: '#6366f1' }} />
      </div>
    );
  }

  const tickets = state?.tickets || [];
  const events = state?.events || [];
  const totalRequests = tickets.length;
  const needsReviewCount = tickets.filter((t) => t.status === 'Needs review').length;
  const approvedCount = tickets.filter((t) => t.status === 'Approved').length;
  const escalatedCount = tickets.filter((t) => t.status === 'Escalated').length;

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      (t.subject + ' ' + t.customer + ' ' + t.message + ' ' + (t.summary || '')).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const providerLabel =
    state?.provider === 'experiential'
      ? `Experiential · ${state.model}`
      : state?.provider === 'gemini'
      ? `Google Gemini · ${state.model}`
      : state?.provider === 'openai'
      ? `OpenAI · ${state.model}`
      : 'Demo Mode';

  return (
    <div className="app-container">
      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            {t.type === 'success' ? (
              <CheckCircle size={18} color="#10b981" />
            ) : t.type === 'error' ? (
              <AlertCircle size={18} color="#f43f5e" />
            ) : (
              <Sparkles size={18} color="#6366f1" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside className="sidebar">
        <a href="/" className="brand">
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <span>SupportDesk</span>
          <span className="brand-badge">AI PILOT</span>
        </a>

        <div className="nav-section-title">Workspace</div>
        <nav className="nav-menu">
          <button
            className={`nav-item-btn ${activeTab === 'inbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('inbox')}
          >
            <Inbox size={18} />
            <span>Support Inbox</span>
            <span className="nav-count">{needsReviewCount}</span>
          </button>

          <button
            className={`nav-item-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={18} />
            <span>Analytics & Triage</span>
          </button>

          <button
            className={`nav-item-btn ${activeTab === 'policy' ? 'active' : ''}`}
            onClick={() => setActiveTab('policy')}
          >
            <FileText size={18} />
            <span>Company Knowledge</span>
          </button>

          <button
            className={`nav-item-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <Clock size={18} />
            <span>Activity History</span>
            <span className="nav-count">{events.length}</span>
          </button>

          <button
            className={`nav-item-btn ${activeTab === 'showcase' ? 'active' : ''}`}
            onClick={() => setActiveTab('showcase')}
          >
            <Layers size={18} />
            <span>Experience Showcase</span>
          </button>

          <button
            className={`nav-item-btn ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            <LogIn size={18} />
            <span>Agent Sign In</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="pilot-card">
            <div className="pilot-header">
              <div className="pilot-title">
                <ShieldCheck size={14} color="#34d399" />
                <span>Human-in-the-loop</span>
              </div>
              <span className="pilot-badge">Active</span>
            </div>
            <p className="pilot-desc">
              AI drafts replies and policy classifications. Your team reviews, edits, and has the final word.
            </p>
          </div>

          <div className="workspace-badge">
            <div className="workspace-avatar">
              {(companyName.charAt(0) || 'W').toUpperCase()}
            </div>
            <div className="workspace-info">
              <span className="workspace-name">{companyName}</span>
              <span className="workspace-role">{providerLabel}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <span className="breadcrumb-active">
              {activeTab === 'inbox'
                ? 'Support Inbox'
                : activeTab === 'analytics'
                ? 'Triage Analytics'
                : activeTab === 'policy'
                ? 'Company Knowledge'
                : 'Activity Log'}
            </span>
          </div>

          <div className="topbar-actions">
            <div className={`status-pill ${state?.live_available ? 'live' : 'demo'}`}>
              <span className="pulse-dot"></span>
              <span>{state?.live_available ? `Live AI (${providerLabel})` : 'Demo Mode (Keyword Rules)'}</span>
            </div>

            <button className="btn btn-secondary" onClick={() => fetchState(false)} title="Refresh data">
              <RefreshCw size={15} />
            </button>

            <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
              <Plus size={16} />
              <span>New Request</span>
            </button>
          </div>
        </header>

        {/* View Router */}
        {activeTab === 'inbox' && (
          <div className="view-container">
            <div className="page-header">
              <div>
                <p className="page-eyebrow">COMMAND CENTER</p>
                <h1 className="page-title">Support Request Triage</h1>
                <p className="page-subtitle">
                  Classify incoming customer tickets, prioritize by urgency, and draft replies instantly.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" onClick={handleExportCSV}>
                  <Download size={15} />
                  <span>Export CSV</span>
                </button>
                <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
                  <Sparkles size={15} />
                  <span>Draft New Reply</span>
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-label">
                  <span>Total Requests</span>
                  <Inbox size={16} color="#818cf8" />
                </div>
                <div className="metric-value">{totalRequests}</div>
                <div className="metric-footer">All tickets recorded in workspace</div>
              </div>

              <div className="metric-card">
                <div className="metric-label">
                  <span>Ready for Review</span>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
                </div>
                <div className="metric-value" style={{ color: '#f59e0b' }}>{needsReviewCount}</div>
                <div className="metric-footer">Waiting for human review</div>
              </div>

              <div className="metric-card">
                <div className="metric-label">
                  <span>Approved Drafts</span>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                </div>
                <div className="metric-value" style={{ color: '#10b981' }}>{approvedCount}</div>
                <div className="metric-footer">Reviewed and verified by team</div>
              </div>

              <div className="metric-card">
                <div className="metric-label">
                  <span>Escalations</span>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f43f5e' }}></span>
                </div>
                <div className="metric-value" style={{ color: '#f43f5e' }}>{escalatedCount}</div>
                <div className="metric-footer">Flagged for human specialist</div>
              </div>
            </div>

            {/* First response workflow banner */}
            <div className="workflow-banner">
              <div className="workflow-info">
                <div className="workflow-icon">
                  <Zap size={20} />
                </div>
                <div className="workflow-text">
                  <strong>AI First-Response Engine is Active</strong>
                  <p>
                    Incoming request <span>→</span> Categorize & Prioritize <span>→</span> Policy-Aware Draft <span>→</span> Human Verification
                  </p>
                </div>
              </div>
              <span className="tag" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#c7d2fe', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                Provider: {state?.provider || 'Demo'}
              </span>
            </div>

            {/* Filter & Search Bar */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title-group">
                  <h2 className="panel-title">Support Inbox</h2>
                  <span className="count-badge">{filteredTickets.length} showing</span>
                </div>
              </div>

              <div className="filter-bar">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search requests, customers, or messages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <select
                  className="select-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Needs review">Needs review</option>
                  <option value="Approved">Approved</option>
                  <option value="Escalated">Escalated</option>
                </select>

                <select
                  className="select-filter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Billing">Billing</option>
                  <option value="Technical">Technical</option>
                  <option value="Account">Account</option>
                  <option value="General">General</option>
                </select>

                <select
                  className="select-filter"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="All">All Priorities</option>
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Ticket list */}
              <div className="ticket-list">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      className="ticket-row"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setReviewDraft(ticket.draft);
                      }}
                    >
                      <div className="customer-avatar">
                        {(ticket.customer?.charAt(0) || '?').toUpperCase()}
                      </div>

                      <div className="ticket-main">
                        <div className="ticket-subject">{ticket.subject}</div>
                        <div className="ticket-meta">
                          <span>{ticket.customer}</span>
                          <span className="dot-sep">•</span>
                          <span>#{ticket.id}</span>
                          <span className="dot-sep">•</span>
                          <span>{ticket.mode === 'live' ? '⚡ Live AI' : 'Demo'}</span>
                          <span className="dot-sep">•</span>
                          <span>{new Date(ticket.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <span className="tag tag-category">{ticket.category}</span>

                      <span className={`tag tag-priority-${ticket.priority.toLowerCase()}`}>
                        {ticket.priority}
                      </span>

                      <span
                        className={`tag tag-status-${
                          ticket.status === 'Approved'
                            ? 'approved'
                            : ticket.status === 'Escalated'
                            ? 'escalated'
                            : 'review'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <Inbox size={28} />
                    </div>
                    <h3>{totalRequests ? 'No matching requests found' : 'Your inbox is ready.'}</h3>
                    <p>
                      {totalRequests
                        ? 'Try clearing your search query or selecting a different filter.'
                        : 'Generate a draft using customer request text and watch the AI triage and prepare a reply.'}
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setIsCreateOpen(true);
                        handleSampleClick();
                      }}
                    >
                      <Sparkles size={16} />
                      <span>✦ Try a Sample Request</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && (
          <div className="view-container">
            <div className="page-header">
              <div>
                <p className="page-eyebrow">INTELLIGENCE & METRICS</p>
                <h1 className="page-title">Triage Analytics</h1>
                <p className="page-subtitle">
                  Overview of classification breakdown, review status, and AI throughput.
                </p>
              </div>
            </div>

            <div className="settings-grid">
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
                  Requests by Category
                </h3>
                {['Billing', 'Technical', 'Account', 'General'].map((cat) => {
                  const count = tickets.filter((t) => t.category === cat).length;
                  const pct = totalRequests ? Math.round((count / totalRequests) * 100) : 0;
                  return (
                    <div key={cat} style={{ marginBottom: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
                        <span style={{ fontWeight: 600 }}>{cat}</span>
                        <span style={{ color: '#94a3b8' }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background:
                              cat === 'Billing'
                                ? '#3b82f6'
                                : cat === 'Technical'
                                ? '#a855f7'
                                : cat === 'Account'
                                ? '#10b981'
                                : '#f59e0b',
                            borderRadius: '9999px',
                            transition: 'width 0.5s ease'
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
                  Priority Breakdown
                </h3>
                {['Urgent', 'High', 'Normal', 'Low'].map((pri) => {
                  const count = tickets.filter((t) => t.priority === pri).length;
                  const pct = totalRequests ? Math.round((count / totalRequests) * 100) : 0;
                  return (
                    <div key={pri} style={{ marginBottom: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
                        <span style={{ fontWeight: 600 }}>{pri}</span>
                        <span style={{ color: '#94a3b8' }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background:
                              pri === 'Urgent'
                                ? '#f43f5e'
                                : pri === 'High'
                                ? '#f59e0b'
                                : pri === 'Normal'
                                ? '#06b6d4'
                                : '#64748b',
                            borderRadius: '9999px',
                            transition: 'width 0.5s ease'
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Company Knowledge View */}
        {activeTab === 'policy' && (
          <div className="view-container">
            <div className="page-header">
              <div>
                <p className="page-eyebrow">POLICY CONTEXT</p>
                <h1 className="page-title">Company Knowledge & Rules</h1>
                <p className="page-subtitle">
                  Live AI reads this knowledge on every draft to cite official policies, refund rules, and hours.
                </p>
              </div>
            </div>

            <div className="settings-grid">
              <form className="card" onSubmit={handleSavePolicy}>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    maxLength={100}
                    placeholder="e.g. Acme Cloud Corp"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Support Policies, FAQ & Rules</label>
                  <textarea
                    className="form-textarea"
                    rows={12}
                    value={policyText}
                    onChange={(e) => setPolicyText(e.target.value)}
                    maxLength={20000}
                    placeholder="Add refund rules, support hours, SLA guidelines, approved technical troubleshooting steps, and escalation criteria. Avoid sensitive credentials."
                  />
                  <div className="form-hint" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Live AI refers to these policies. Never commits refunds unless allowed.</span>
                    <span>{policyText.length} / 20,000 chars</span>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSavingPolicy}>
                  {isSavingPolicy ? <RefreshCw className="animate-spin" size={16} /> : <Check size={16} />}
                  <span>{isSavingPolicy ? 'Saving Knowledge…' : 'Save Company Knowledge'}</span>
                </button>
              </form>

              {/* Setup Status Box */}
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
                  AI Provider Status
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  SupportDesk connects directly to your chosen provider with zero intermediary logging.
                </p>

                <div className="info-box">
                  <div className="info-item">
                    <span className="info-label">Active Provider</span>
                    <span className="info-value" style={{ color: '#818cf8' }}>{state?.provider || 'None (Demo)'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Active Model</span>
                    <span className="info-value">{state?.model || 'Rule-based'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Live Status</span>
                    <span className="info-value" style={{ color: state?.live_available ? '#34d399' : '#fbbf24' }}>
                      {state?.live_available ? 'Connected' : 'Offline (Demo)'}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '20px', fontSize: '0.82rem', color: '#64748b' }}>
                  <p style={{ marginBottom: '8px' }}>
                    Configured via <code>.env</code> file in project directory:
                  </p>
                  <ul style={{ paddingLeft: '16px', lineHeight: 1.6 }}>
                    <li><code>EXPLABS_API_KEY</code> for Experiential Labs</li>
                    <li><code>GEMINI_API_KEY</code> for Google Gemini</li>
                    <li><code>OPENAI_API_KEY</code> for OpenAI</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Log View */}
        {activeTab === 'activity' && (
          <div className="view-container">
            <div className="page-header">
              <div>
                <p className="page-eyebrow">AUDIT RECORD</p>
                <h1 className="page-title">Activity Timeline</h1>
                <p className="page-subtitle">
                  Complete history of draft generation, human review, approvals, and escalations.
                </p>
              </div>
            </div>

            <div className="card">
              {events.length > 0 ? (
                <div className="timeline">
                  {events.map((event) => (
                    <div key={event.id} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-title">
                          Ticket #{event.ticket_id}: {event.action}
                        </div>
                        <div className="timeline-time">
                          {new Date(event.created).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Clock size={32} color="#64748b" />
                  <p>No activity recorded yet. Generate your first draft to start the timeline.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Showcase View */}
        {activeTab === 'showcase' && (
          <div style={{ width: '100%', minHeight: '100vh', background: '#ececeb' }}>
            <StackSpreadDemo />
          </div>
        )}

        {/* Sign In View */}
        {activeTab === 'signin' && (
          <div className="view-container" style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ maxWidth: '840px', width: '100%' }}>
              <SignIn6
                companyName={companyName}
                onSuccess={(userEmail) => {
                  addToast(`Signed in successfully as ${userEmail}`, 'success');
                  setActiveTab('inbox');
                }}
              />
            </div>
          </div>
        )}
      </main>

      {/* CREATE NEW REQUEST MODAL */}
      {isCreateOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="page-eyebrow">NEW TRIAGE</p>
                <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                  Incoming Customer Request
                </h2>
              </div>
              <button className="close-btn" onClick={() => setIsCreateOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Customer Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Maya Patel"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    required
                    maxLength={120}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Brief description of the customer's problem"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    maxLength={200}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Customer Message</label>
                  <textarea
                    className="form-textarea"
                    rows={6}
                    placeholder="Paste the raw incoming customer email, ticket, or message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    maxLength={12000}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Processing Engine</label>
                  <select
                    className="form-select"
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                  >
                    <option value="live" disabled={!state?.live_available}>
                      Live AI — {providerLabel} {state?.live_available ? '(Active)' : '(Requires API Key)'}
                    </option>
                    <option value="demo">Demo Mode — Keyword rules & template reply</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSampleClick}
                >
                  <Sparkles size={15} />
                  <span>Try a Sample</span>
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <RefreshCw className="animate-spin" size={16} />
                      <span>Drafting with AI…</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>✦ Generate Draft</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW & HUMAN APPROVAL MODAL */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <div className="modal-header">
              <div>
                <p className="page-eyebrow">
                  REQUEST #{selectedTicket.id} · {selectedTicket.mode === 'live' ? 'LIVE AI DRAFT' : 'DEMO OUTPUT'}
                </p>
                <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                  {selectedTicket.subject}
                </h2>
              </div>
              <button className="close-btn" onClick={() => setSelectedTicket(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Badges */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <span className="tag tag-category">{selectedTicket.category}</span>
                <span className={`tag tag-priority-${selectedTicket.priority.toLowerCase()}`}>
                  Priority: {selectedTicket.priority}
                </span>
                <span
                  className={`tag tag-status-${
                    selectedTicket.status === 'Approved'
                      ? 'approved'
                      : selectedTicket.status === 'Escalated'
                      ? 'escalated'
                      : 'review'
                  }`}
                >
                  {selectedTicket.status}
                </span>
              </div>

              {/* Customer original message */}
              <div className="customer-msg-card">
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                  Message from {selectedTicket.customer}:
                </div>
                <div style={{ fontSize: '0.92rem', color: '#f8fafc', whiteSpace: 'pre-wrap' }}>
                  {selectedTicket.message}
                </div>
              </div>

              {/* Agent summary */}
              {selectedTicket.summary && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#818cf8', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Agent Summary
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{selectedTicket.summary}</p>
                </div>
              )}

              {/* Agent reason / safety note */}
              {selectedTicket.reason && (
                <div className="reason-box">
                  <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '2px' }}>Policy Interpretation & Flags:</strong>
                    <span>{selectedTicket.reason}</span>
                  </div>
                </div>
              )}

              {/* Editable Reply Draft */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    Proposed Response Draft (Editable)
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Human review required before sending
                  </span>
                </div>
                <textarea
                  className="form-textarea"
                  rows={8}
                  value={reviewDraft}
                  onChange={(e) => setReviewDraft(e.target.value)}
                  maxLength={12000}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCopyDraft}
                title="Copy draft to clipboard"
              >
                <Copy size={15} />
                <span>Copy Reply</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                disabled={isReviewing}
                onClick={() => handleReviewAction('Needs review')}
              >
                Save Draft
              </button>

              <button
                type="button"
                className="btn btn-danger"
                disabled={isReviewing}
                onClick={() => handleReviewAction('Escalated')}
              >
                Escalate
              </button>

              <button
                type="button"
                className="btn btn-success"
                disabled={isReviewing}
                onClick={() => handleReviewAction('Approved')}
              >
                <Check size={16} />
                <span>Approve Draft</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
