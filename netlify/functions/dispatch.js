import fetch from "node-fetch";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const {
    type,
    slug,
    episode,
    html,
    json
  } = JSON.parse(event.body);

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo  = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !owner || !repo) {
    return { statusCode: 500, body: "GitHub ENV missing" };
  }

  // Decide file path
  let filePath = "";

  if (type === "movie") {
    filePath = `movies/${slug}.html`;
  } else if (type === "series-main") {
    filePath = `series/${slug}.html`;
  } else if (type === "episode") {
    filePath = `series/${slug}/episode-${episode}.html`;
  } else {
    return { statusCode: 400, body: "Invalid content type" };
  }

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  const contentBase64 = Buffer.from(html).toString("base64");

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Authorization": `token ${token}`,
      "Accept": "application/vnd.github+json"
    },
    body: JSON.stringify({
      message: `Auto publish: ${filePath}`,
      content: contentBase64,
      branch
    })
  });

  if (!res.ok) {
    const err = await res.text();
    return { statusCode: 500, body: err };
  }

  return {
    statusCode: 200,
    body: "Published successfully"
  };
}
