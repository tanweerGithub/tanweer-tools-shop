const XRAY_BASE = "https://xray.cloud.getxray.app/api/v2";

let cachedToken = null;

async function authenticate() {
  const clientId = process.env.XRAY_CLIENT_ID;
  const clientSecret = process.env.XRAY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("XRAY_CLIENT_ID and XRAY_CLIENT_SECRET must be set in the environment");
  }

  const res = await fetch(`${XRAY_BASE}/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret }),
  });

  if (!res.ok) {
    throw new Error(`Xray authentication failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

export async function xrayGraphQL(query) {
  if (!cachedToken) {
    cachedToken = await authenticate();
  }

  const res = await fetch(`${XRAY_BASE}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cachedToken}`,
    },
    body: JSON.stringify({ query }),
  });

  const body = await res.json();
  if (body.errors) {
    throw new Error(`Xray GraphQL error: ${JSON.stringify(body.errors, null, 2)}`);
  }

  return body.data;
}

export function gqlString(str) {
  return JSON.stringify(str ?? "");
}
