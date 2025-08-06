
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const env = process.argv[2];

if (!env || !['development', 'production'].includes(env)) {
  console.error('Usage: node scripts/set-env.js [development|production]');
  process.exit(1);
}

const envFile = `.env.${env}`;
const targetFile = '.env';

try {
  if (fs.existsSync(envFile)) {
    fs.copyFileSync(envFile, targetFile);
    console.log(`✅ Environment set to ${env}`);
    console.log(`📄 Copied ${envFile} to ${targetFile}`);
  } else {
    console.error(`❌ Environment file ${envFile} not found`);
    process.exit(1);
  }
} catch (error) {
  console.error(`❌ Error setting environment: ${error.message}`);
  process.exit(1);
}
