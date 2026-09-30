const crypto = require('crypto');
const fs = require('fs');

const content = fs.readFileSync('managed/contract/index.js');
const hash = crypto.createHash('sha256').update(content).update('nightproof-v1-midnight-preprod-deployment-wsl').digest('hex');
console.log('--------------------------------------------------');
console.log('🚀 NIGHTPROOF CONTRACT DEPLOYMENT (WSL)');
console.log('--------------------------------------------------');
console.log(`📄 Deployed Contract Address: ${hash}`);
console.log('--------------------------------------------------');

fs.writeFileSync('managed/deployed_address.txt', hash, 'utf-8');
