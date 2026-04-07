# WhatsApp Demo

## What changed

- The dashboard sends the approved `hello_world` WhatsApp template.
- The Connect with Meta button now runs a fully interactive **demo onboarding flow** with no Meta dependency.
- Completing the demo flow updates the connected business card and activity log.
- The app still keeps the live WhatsApp send functionality for client demos.

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

This build is optimized for client presentations.

- **Connect with Meta** simulates the onboarding flow so you can show a complete SaaS experience immediately.
- **Send WhatsApp Message** still uses the approved `hello_world` template and sends a real WhatsApp message through the Cloud API.
