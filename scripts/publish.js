import fs from "fs";
import path from "path";

const data = JSON.parse(process.env.PAYLOAD || "{}");
const { type, slug, episode, html } = data;

if (!type || !slug || !html) {
  console.error("Missing required payload");
  process.exit(1);
}

let filePath = "";

if (type === "movie") {
  filePath = `movies/${slug}.html`;
}
if (type === "series-main") {
  filePath = `series/${slug}/index.html`;
}
if (type === "episode") {
  filePath = `series/${slug}/episode-${episode}.html`;
}

// ensure folder exists
fs.mkdirSync(path.dirname(filePath), { recursive: true });

// write file
fs.writeFileSync(filePath, html, "utf8");

console.log("Published:", filePath);
