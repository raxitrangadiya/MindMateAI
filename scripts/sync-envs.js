import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const rootEnvPath = path.join(rootDir, '.env');
const rootEnvExamplePath = path.join(rootDir, '.env.example');

const targets = [
  path.join(rootDir, 'H2C-Client', '.env'),
  path.join(rootDir, 'H2C-Server', '.env')
];

function syncEnvs() {
  console.log('🔄 Syncing environment variables...');

  // If root .env doesn't exist but .env.example does, initialize it
  if (!fs.existsSync(rootEnvPath)) {
    if (fs.existsSync(rootEnvExamplePath)) {
      console.log('⚠️  No root .env found. Initializing from .env.example...');
      fs.copyFileSync(rootEnvExamplePath, rootEnvPath);
    } else {
      console.error('❌ Error: Neither .env nor .env.example exists at root.');
      process.exit(1);
    }
  }

  // Read the root env file content
  const envContent = fs.readFileSync(rootEnvPath, 'utf8');

  // Copy to each target directory
  for (const targetPath of targets) {
    const parentDir = path.dirname(targetPath);
    if (!fs.existsSync(parentDir)) {
      console.warn(`⚠️  Target directory ${parentDir} does not exist. Skipping...`);
      continue;
    }
    
    fs.writeFileSync(targetPath, envContent, 'utf8');
    console.log(`✅ Synced env to: ${path.relative(rootDir, targetPath)}`);
  }

  console.log('🎉 Environment synchronization complete!');
}

syncEnvs();
