# SupportDesk

A working local pilot for a customer-support automation product. It classifies requests, assigns priority, drafts replies, and stores a human review history. Built with Python's standard library and a responsive browser interface; no package installation required.

## Start

From this project folder, run:

```powershell
python server.py
```

Open http://127.0.0.1:8765. Select **New request → Try a sample → Generate draft**. Edit the draft, then save, approve, or escalate it. Company knowledge sets the company name and policies. CSV export downloads the workspace's tickets and saved replies.

## Enable live AI

You can use **Google Gemini** (recommended) or **OpenAI** for live AI drafting.

### Using Google's API Key (Gemini)

1. Get an API key from [Google AI Studio](https://aistudio.google.com/).
2. Create a `.env` file in the project folder (or copy `.env.example`):
   ```powershell
   copy .env.example .env
   ```
3. Set your key in `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Or set it in your environment:
   ```powershell
   $env:GEMINI_API_KEY="your_gemini_api_key_here"
   ```
4. *(Optional)* Set `GEMINI_MODEL` to choose a model (default is `gemini-2.5-flash`, also supports `gemini-1.5-flash`, `gemini-2.0-flash`, `gemini-1.5-pro`).

### Using OpenAI (Alternative)

Set `OPENAI_API_KEY` in `.env` or your environment. Optionally set `OPENAI_MODEL` (default: `gpt-5.2`). If both keys are present, set `AI_PROVIDER=gemini` or `AI_PROVIDER=openai` to choose.

### Security and Privacy

Do not commit `.env` or paste keys into tickets, company knowledge, source code, or chat. Restart the server and select **Live AI** when creating a request. API usage is billed by your provider. With no key configured, the app explicitly uses keyword rules and template replies; it never presents those as model-generated content. Live mode sends customer name, subject, message, and company knowledge to the configured AI provider. The key stays on your local server.

## Included

- Billing, Technical, Account, and General classification; four priority levels.
- Policy-aware live AI drafts, summary, and review notes.
- Editable replies, approvals, escalation status, search, filters, CSV export.
- Persistent SQLite storage, company configuration, and activity history.
- Localhost binding, host checks, mutation tokens, origin checks, request limits, escaped UI content, and spreadsheet formula neutralization in CSV export.
- Explicit provider errors and completion checks; failed AI calls do not silently become demo output.

Approval saves a draft only. Escalation records a status only. This pilot does not send email, contact a customer, issue refunds, or connect to a helpdesk. Requests are entered manually, and each generation is initiated by the user.

## Before selling a hosted service

This is a single-company, single-operator local pilot, not a production multi-tenant SaaS. Anyone with access to this computer's local app can read its records. SQLite stores customer messages and drafts unencrypted; use test data for demos. Do not expose this development server publicly.

The next release needs authenticated organizations and roles, tested tenant isolation, a production web server, HTTPS, encrypted storage and secret management, backups and deletion/retention controls, a durable job queue with retry/idempotency handling, usage limits and billing, and signed helpdesk integrations. The current audit history records actions but not verified user identities or past draft versions.

For a first commercial pilot, choose one helpdesk integration (such as Zendesk or Freshdesk), measure draft acceptance rate and review time on a consented test set, and have the company's support team review every reply. Add customer-specific policies and evaluate unsupported commitments, prompt injection, and sensitive-data handling before unattended automation.

## Tests

```powershell
python -m unittest discover -s tests -v
node --check static/app.js
```

Tests use a temporary database and mock the live AI endpoint; they incur no API charges. An actual live-provider run requires your API key and has not been verified by those tests.

`SUPPORT_DB` changes the database path. `PORT` changes the local port (default 8765). The default `support.db` and secrets are excluded from Git.
