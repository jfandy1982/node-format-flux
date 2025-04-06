const fs = require('fs');
const path = require('path');

// Hole den Library-Namen aus den Argumenten
const libraryName = process.argv[2];
if (!libraryName) {
  console.error('NX_PROJECT_NAME ist nicht gesetzt. Bitte sicherstellen, dass das Skript im Kontext von Nx ausgeführt wird.');
  process.exit(1);
}

// Dynamische Pfade basierend auf dem Library-Namen
const projectDir = path.resolve(__dirname, `../packages/${libraryName}`);
const distDir = path.resolve(__dirname, `../dist/${libraryName}`);
const esmDir = path.join(distDir, 'esm');
const cjsDir = path.join(distDir, 'cjs');
const outputDir = distDir; // Zielverzeichnis für das kombinierte Paket

// Kopiere Dateien aus ESM und CJS in das Zielverzeichnis
function copyFiles(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.error(`Verzeichnis nicht gefunden: ${srcDir}`);
    return;
  }
  fs.readdirSync(srcDir).forEach((file) => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`Datei kopiert: ${srcFile} -> ${destFile}`);
    }
  });
}

// Entferne unerwünschte Dateien aus einem Verzeichnis
function removeUnwantedFiles(dir, filesToRemove) {
  if (!fs.existsSync(dir)) {
    console.error(`Verzeichnis nicht gefunden: ${dir}`);
    return;
  }
  filesToRemove.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Datei entfernt: ${filePath}`);
    }
  });
}

// Erstelle die konsolidierte package.json
function createPackageJson() {
  const packageJsonPath = path.join(projectDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error(`package.json nicht gefunden: ${packageJsonPath}`);
    return;
  }
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  // Passe die Felder an
  packageJson.main = './cjs/index.js';
  packageJson.module = './esm/index.js';
  packageJson.types = './esm/index.d.ts';
  packageJson.exports = {
    require: './cjs/index.js',
    import: './esm/index.js',
  };
  packageJson.files = ['esm', 'cjs'];

  // Schreibe die neue package.json
  fs.writeFileSync(path.join(outputDir, 'package.json'), JSON.stringify(packageJson, null, 2));
  console.log('package.json erstellt.');
}

// Hauptfunktion
function combineBuilds() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Zielverzeichnis erstellt: ${outputDir}`);
  }

  copyFiles(esmDir, outputDir);
  copyFiles(cjsDir, outputDir);

  // Entferne README.md und package.json aus esm und cjs
  removeUnwantedFiles(esmDir, ['README.md', 'package.json']);
  removeUnwantedFiles(cjsDir, ['README.md', 'package.json']);

  createPackageJson();

  console.log(`Builds für ${libraryName} kombiniert und unerwünschte Dateien entfernt.`);
}

try {
  combineBuilds();
} catch (error) {
  console.error('Error during combine-builds: ', error);
  process.exit(1);
}
