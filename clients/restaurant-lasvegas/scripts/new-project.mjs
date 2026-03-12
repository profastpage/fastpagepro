import fs from "fs";
import path from "path";

const projectName = process.argv[2];
const brandName = process.argv[3] || projectName;
const firebaseProjectId = process.argv[4] || ""; // opcional

if (!projectName) {
  console.log("Uso:");
  console.log('npm run new-project "restaurant-texas" "Restaurant Texas" "firebaseProjectId(opcional)"');
  process.exit(1);
}

const templateDir = process.cwd(); // Fastpage-template
const parentDir = path.resolve(templateDir, "..");
const clientsDir = path.join(parentDir, "clients");
const newProjectDir = path.join(clientsDir, projectName);

const ignore = ["node_modules", ".next", ".git", ".turbo", ".vercel", "dist", "build", "out"];

function copyFolder(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const items = fs.readdirSync(src, { withFileTypes: true });

  for (const item of items) {
    if (ignore.includes(item.name)) continue;

    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) copyFolder(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function safeReplaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let txt = fs.readFileSync(filePath, "utf8");
  let changed = false;
  for (const [from, to] of replacements) {
    if (txt.includes(from)) {
      txt = txt.split(from).join(to);
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(filePath, txt);
}

function writeEnvLocal() {
  const envExample = path.join(newProjectDir, ".env.example");
  const envLocal = path.join(newProjectDir, ".env.local");

  if (fs.existsSync(envExample) && !fs.existsSync(envLocal)) {
    fs.copyFileSync(envExample, envLocal);
  } else if (!fs.existsSync(envLocal)) {
    fs.writeFileSync(envLocal, "");
  }

  // añade variables comunes sin romper las existentes
  let env = fs.readFileSync(envLocal, "utf8");

  const addLine = (k, v) => {
    const re = new RegExp(`^${k}=`, "m");
    if (!re.test(env)) env += (env.endsWith("\n") || env.length === 0 ? "" : "\n") + `${k}=${v}\n`;
  };

  addLine("NEXT_PUBLIC_APP_NAME", JSON.stringify(brandName));
  if (firebaseProjectId) addLine("NEXT_PUBLIC_FIREBASE_PROJECT_ID", firebaseProjectId);

  fs.writeFileSync(envLocal, env);
}

function updatePackageName() {
  const pkgPath = path.join(newProjectDir, "package.json");
  if (!fs.existsSync(pkgPath)) return;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.name = projectName;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

// 1) crear clients/
if (!fs.existsSync(clientsDir)) fs.mkdirSync(clientsDir, { recursive: true });

// 2) no sobreescribir
if (fs.existsSync(newProjectDir)) {
  console.error("❌ Ya existe:", newProjectDir);
  process.exit(1);
}

// 3) copiar template
copyFolder(templateDir, newProjectDir);

// 4) set .env.local
writeEnvLocal();

// 5) set package.json name
updatePackageName();

// 6) reemplazos comunes (branding simple)
safeReplaceInFile(path.join(newProjectDir, "src", "app", "layout.tsx"), [
  ['title: "Fast Page"', `title: ${JSON.stringify(brandName)}`],
  ['title: "Fast Page",', `title: ${JSON.stringify(brandName)},`],
]);

safeReplaceInFile(path.join(newProjectDir, "README.md"), [
  ["Fast Page", brandName],
  ["fast-page", projectName],
]);

console.log("✅ Proyecto creado y configurado:");
console.log(newProjectDir);
console.log("");
console.log("Siguiente:");
console.log(`cd ..\\clients\\${projectName}`);
console.log("npm install");
console.log("npm run dev");