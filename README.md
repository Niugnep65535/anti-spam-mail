# Anti-Spam Mail

A customizable blacklist Worker for [Cloudflare Email Routing](https://developers.cloudflare.com/email-routing/). The Worker rejects mail from exact blocked addresses or sender addresses with configured prefixes or suffixes, and forwards all remaining mail to a destination address.

## Features

- Block an exact sender address
- Block addresses that start with a specified string
- Block addresses that end with a specified string
- Return a custom rejection message
- Forward allowed mail to a configured address

## How it works

The filtering rules are defined in [`index.js`](/home/niugnep/Projects/anti-spam-mail/index.js):

| Rule | Default examples |
| --- | --- |
| `blackList` | `devnull@niugnep.idv.tw` |
| `startsWith` | `careless`, `market` |
| `endsWith` | `mcpcnserver.com` |

The sender is rejected when it:

1. Exactly matches an entry in `blackList`
2. Starts with an entry in `startsWith`
3. Ends with an entry in `endsWith`

Matching is case-sensitive. A rejected message receives `Still sending spam mails? Pathetic...`; other messages are forwarded to `FORWARD_EMAIL`.

## Requirements

- A Cloudflare account with Email Routing enabled for a zone
- A verified destination email address
- Node.js and npm for installing/running Wrangler
- A custom domain managed by Cloudflare

## Configuration

### 1. Set the forwarding destination

Add `FORWARD_EMAIL` to the Worker through the Cloudflare dashboard:

1. Open **Workers & Pages**.
2. Select `anti-spam-mail`.
3. Open **Settings > Variables and Secrets**.
4. Add a text variable named `FORWARD_EMAIL`.
5. Set its value to the verified destination email address.
6. Save and deploy the Worker.

You can also add the variable in [`wrangler.jsonc`](/home/niugnep/Projects/anti-spam-mail/wrangler.jsonc):

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

Do not commit a real forwarding address if the repository is public.

### 2. Customize the rules

Edit the arrays near the top of [`index.js`](/home/niugnep/Projects/anti-spam-mail/index.js):

```js
const blackList = [
  "blocked@example.com"
];

const startsWith = [
  "newsletter",
  "offer"
];

const endsWith = [
  "example.invalid"
];
```

After editing, deploy the updated Worker.

## Deployment

```bash
git clone https://github.com/Niugnep65535/anti-spam-mail.git
cd anti-spam-mail
npx wrangler login
npx wrangler deploy
```

Alternatively, import or upload this repository in Cloudflare and deploy `index.js` as a Worker.

## Connect Email Routing

1. Open **Email Routing** for your Cloudflare zone.
2. Complete the setup and verify at least one destination address.
3. Create or edit a catch-all route.
4. Set the action to **Send to a Worker**.
5. Select `anti-spam-mail`.
6. Save the route and test it with an allowed and a blocked sender address.

## Local development

There is no separate local test suite or local Email Routing emulator in this repository. You can validate JavaScript syntax with Node.js:

```bash
node --check index.js
```

Deploy and test end-to-end through Cloudflare Email Routing for meaningful verification.

## Security

- The exact blacklist is intended for known sender addresses and is not a replacement for SPF, DKIM, or DMARC filtering.
- Prefix and suffix matching can block legitimate addresses; review the entries carefully.
- Use Email Routing's destination verification and Cloudflare security controls to reduce configuration and account risk.

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).
