export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body = JSON.parse(event.body);

  const res = await fetch(
    `https://api.github.com/repos/Mohan0123/testing/dispatches`,
    {
      method: "POST",
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event_type: "publish-page",
        client_payload: body
      })
    }
  );

  if (!res.ok) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "GitHub dispatch failed" })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
}
