const fs = require("node:fs/promises");
const path = require("node:path");

const root = process.cwd();
const distDir = path.join(root, "dist");
const outDir = path.join(root, "out");

async function copyRecursive(src, dest) {
  const stats = await fs.stat(src);
  if (stats.isDirectory()) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src);
    for (const entry of entries) {
      await copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    await fs.copyFile(src, dest);
  }
}

async function prepare() {
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.mkdir(distDir, { recursive: true });
  try {
    await fs.stat(outDir);
  } catch {
    return;
  }
  await copyRecursive(outDir, distDir);
}

prepare().catch((error) => {
  console.error("prepareDist failed:", error);
  process.exit(1);
});
