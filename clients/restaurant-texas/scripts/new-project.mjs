import fs from "fs";
import path from "path";

const projectName = process.argv[2];

if (!projectName) {
  console.log("Usa: npm run new-project nombre-proyecto");
  process.exit(1);
}

const templateDir = process.cwd();
const parentDir = path.resolve(templateDir, "..");
const clientsDir = path.join(parentDir, "clients");
const newProjectDir = path.join(clientsDir, projectName);

const ignore = ["node_modules", ".next", ".git"];

function copyFolder(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  const items = fs.readdirSync(src);

  for (const item of items) {
    if (ignore.includes(item)) continue;

    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyFolder(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(clientsDir)) {
  fs.mkdirSync(clientsDir);
}

copyFolder(templateDir, newProjectDir);

console.log("Proyecto creado en:");
console.log(newProjectDir);