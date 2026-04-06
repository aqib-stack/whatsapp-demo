# WhatsApp Demo

## What changed
- The dashboard now sends the approved `hello_world` WhatsApp template.
- This is the most reliable demo flow because it matches the Meta API Setup test message behavior.
- The activity log now shows a cleaner success/failure summary.

## Setup
1. Copy `.env.example` to `.env.local`
2. Add your WhatsApp Cloud API credentials
3. Run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## Demo note
For this demo, the textarea explains that the approved template is being sent. This avoids free-text delivery issues outside the 24-hour customer service window.
