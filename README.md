# Anti-Spam Mail

A customizable mesugaki-style blacklist Worker for [Cloudflare Email Routing](https://developers.cloudflare.com/email-routing/). The Worker rejects mail from exact blocked addresses or sender addresses matching configured prefixes or suffixes defined in a JSON file, and forwards all remaining mail to a destination address.

## Features

- Externalized filtering rules in `blocklist.json`
- Block exact sender addresses
- Block addresses starting with specified prefixes
- Block addresses ending with specified suffixes
- Case-insensitive sender matching
- Return a custom SMTP rejection message
- Forward allowed mail to a configured destination address

## How it works

The filtering rules are defined in [`blocklist.json`](blocklist.json) and bundled into [`index.js`](index.js) at build/deploy time:

| Rule | Default examples |
| --- | --- |
| `blackList` | `devnull@niugnep.idv.tw` |
| `startsWith` | `careless`, `market` |
| `endsWith` | `mcpcnserver.com` |

When an email arrives, the Worker normalizes `message.from` to lowercase and rejects the sender if it:

1. Exactly matches an entry in `blackList`
2. Starts with an entry in `startsWith`
3. Ends with an entry in `endsWith`

> **Note:** Because incoming sender addresses are converted to lowercase before comparison, all entries in `blocklist.json` must be written in lowercase.

Rejected messages receive the error `Still sending spam mails? Pathetic...`; all other messages are forwarded to `FORWARD_EMAIL`.

## Requirements

- A Cloudflare account with Email Routing enabled for a zone
- A verified destination email address
- Node.js and npm for installing and running Wrangler
- A custom domain managed by Cloudflare

## Configuration

### 1. Set the forwarding destination

Add `FORWARD_EMAIL` to the Worker through the Cloudflare dashboard:

1. Open **Workers & Pages**.
2. Select `anti-spam-mail`.
3. Open **Settings > Variables and Secrets**.
4. Add a text variable named `FORWARD_EMAIL`.
5. Set its value to your verified destination email address.
6. Save and deploy the Worker.

Alternatively, you can define the variable in [`wrangler.jsonc`](wrangler.jsonc):

```jsonc
{
  "name": "anti-spam-mail",
  "main": "index.js",
  "compatibility_date": "2026-11-01",
  "vars": {
    "FORWARD_EMAIL": "you@example.com"
  }
}
```

Do not commit a real forwarding address if your repository is public.

### 2. Customize the rules

Edit [`blocklist.json`](blocklist.json) with your desired lowercase rules:

```json
{
  "blackList": [
    "blocked@example.com"
  ],
  "startsWith": [
    "newsletter",
    "offer"
  ],
  "endsWith": [
    "example.invalid"
  ]
}
```

After editing `blocklist.json`, redeploy the Worker so Cloudflare bundles the updated rules.

## Deployment

```bash
git clone https://github.com/Niugnep65535/anti-spam-mail.git
cd anti-spam-mail
npx wrangler login
npx wrangler deploy
```

Alternatively, import or upload this repository in the Cloudflare dashboard and deploy `index.js` along with `blocklist.json`.

## Connect Email Routing

1. Open **Email Routing** for your Cloudflare zone.
2. Complete the setup and verify at least one destination address.
3. Create or edit a catch-all route.
4. Set the action to **Send to a Worker**.
5. Select `anti-spam-mail`.
6. Save the route and test it with both an allowed and a blocked sender address.

## Local development

There is no separate local test suite or Email Routing emulator in this repository. Before deploying, you can validate the JavaScript and JSON syntax locally with Node.js:

```bash
node --check index.js && node -e "JSON.parse(require('fs').readFileSync('blocklist.json', 'utf8'))"
```

Deploy and test end-to-end through Cloudflare Email Routing for full verification.

## Security

- The blacklist is intended for filtering known unwanted senders and is not a replacement for SPF, DKIM, or DMARC authentication.
- Prefix and suffix matching can inadvertently block legitimate addresses; review entries in `blocklist.json` carefully.
- Use Email Routing's destination verification and Cloudflare's security controls to minimize configuration and account risks.

## AI usage

This `README.md` was drafted and updated with AI assistance (GitHub Copilot and Gemini), and has undergone human review.

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).
