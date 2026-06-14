const fs = require('fs');
const path = require('path');

const action = process.argv[2]; // '--backup' or '--restore'

const filesToProcess = [
    path.join(__dirname, '../webapp/model/firebase.ts'),
    path.join(__dirname, '../webapp/controller/main.controller.ts')
];

if (action === '--backup') {
    // Load .env locally if exists
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf8');
        envFile.split('\n').forEach(line => {
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                } else if (value.startsWith("'") && value.endsWith("'")) {
                    value = value.slice(1, -1);
                }
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    }

    const replacements = {
        'FIREBASE_API_KEY': process.env.FIREBASE_API_KEY || 'AIzaSyChnPo9nTSEFrQVP4ghoBTrMky5yfvot4s',
        'FIREBASE_AUTH_DOMAIN': process.env.FIREBASE_AUTH_DOMAIN || 'portfolio-7b056.firebaseapp.com',
        'FIREBASE_DATABASE_URL': process.env.FIREBASE_DATABASE_URL || 'https://portfolio-7b056-default-rtdb.firebaseio.com',
        'FIREBASE_PROJECT_ID': process.env.FIREBASE_PROJECT_ID || 'portfolio-7b056',
        'FIREBASE_STORAGE_BUCKET': process.env.FIREBASE_STORAGE_BUCKET || 'portfolio-7b056.appspot.com',
        'FIREBASE_MESSAGING_SENDER_ID': process.env.FIREBASE_MESSAGING_SENDER_ID || '28130104990',
        'FIREBASE_APP_ID': process.env.FIREBASE_APP_ID || '1:28130104990:web:886caa46e6d492c2ea8d8f',
        'FIREBASE_MEASUREMENT_ID': process.env.FIREBASE_MEASUREMENT_ID || 'G-59WKP2F05T',
        'SMTP_SECURE_TOKEN': process.env.SMTP_SECURE_TOKEN || '41f3b9f9-dfd0-4acd-8e47-4d82d5c96692'
    };

    filesToProcess.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            // Backup the original file
            fs.copyFileSync(filePath, filePath + '.bak');
            
            let content = fs.readFileSync(filePath, 'utf8');
            let updated = false;
            
            Object.keys(replacements).forEach(key => {
                const placeholder = `process.env.${key}`;
                if (content.includes(placeholder)) {
                    content = content.replaceAll(placeholder, `"${replacements[key]}"`);
                    updated = true;
                }
            });
            
            if (updated) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`[inject-env] Injected environment variables into ${path.basename(filePath)}`);
            }
        }
    });
} else if (action === '--restore') {
    filesToProcess.forEach(filePath => {
        const backupPath = filePath + '.bak';
        if (fs.existsSync(backupPath)) {
            // Restore from backup
            fs.copyFileSync(backupPath, filePath);
            fs.unlinkSync(backupPath);
            console.log(`[inject-env] Restored original ${path.basename(filePath)}`);
        }
    });
} else {
    console.error('Usage: node inject-env.js --backup | --restore');
    process.exit(1);
}
