// Moves each distribution that has an asset on the published release to that
// release. A distribution not shipped in it keeps its entry.
// Usage: node .github/update-feed.js <tag> <release page url> <asset names as JSON>
const fs = require("fs");
const path = require("path");

const FEED = path.join(__dirname, "..", "update-feed.json");

const [tag, url, assetsJson] = process.argv.slice(2);
const version = tag.replace(/^v/, "");
if (!/^\d+(\.\d+)*$/.test(version)) throw new Error(`not a plain version: ${tag}`);
if (!url.startsWith("https://")) throw new Error(`not https: ${url}`);

const assets = JSON.parse(assetsJson);
const has = (...exts) => assets.some((name) => exts.some((ext) => name.endsWith(ext)));

const feed = JSON.parse(fs.readFileSync(FEED, "utf8"));
if (has(".exe", ".AppImage")) feed.electron = { version, url };
if (has(".apk")) feed.android = { version, url };
fs.writeFileSync(FEED, JSON.stringify(feed, null, 2) + "\n");
