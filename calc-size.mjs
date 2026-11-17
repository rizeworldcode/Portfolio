import fs from 'fs';
import path from 'path';

const targetDir = path.resolve('video/public');
const videoExts = new Set(['.mp4', '.mov', '.webm', '.avi', '.m4v', '.mkv']);

let totalBytes = 0;
let totalCount = 0;
const folderBreakdown = {};
const videoList = [];

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scan(fullPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (videoExts.has(ext)) {
        const stat = fs.statSync(fullPath);
        totalBytes += stat.size;
        totalCount++;
        const relDir = path.relative(targetDir, dir) || '(root of public)';
        if (!folderBreakdown[relDir]) {
          folderBreakdown[relDir] = { count: 0, bytes: 0 };
        }
        folderBreakdown[relDir].count++;
        folderBreakdown[relDir].bytes += stat.size;
        videoList.push({
          name: entry.name,
          folder: relDir,
          sizeMB: (stat.size / (1024 * 1024)).toFixed(2),
        });
      }
    }
  }
}

scan(targetDir);

console.log('--- Breakdown by Folder ---');
for (const [folder, data] of Object.entries(folderBreakdown)) {
  const mb = (data.bytes / (1024 * 1024)).toFixed(2);
  const gb = (data.bytes / (1024 * 1024 * 1024)).toFixed(3);
  console.log(`${folder}: ${data.count} videos | ${mb} MB (${gb} GB)`);
}

console.log('---------------------------');
console.log(`Total Videos: ${totalCount}`);
console.log(`Total Size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Total Size: ${(totalBytes / (1024 * 1024 * 1024)).toFixed(3)} GB`);

// Top 5 largest videos
videoList.sort((a, b) => parseFloat(b.sizeMB) - parseFloat(a.sizeMB));
console.log('--- Top 5 Largest Videos ---');
videoList.slice(0, 5).forEach((v, i) => {
  console.log(`${i + 1}. ${v.name} (${v.folder}) -> ${v.sizeMB} MB`);
});
