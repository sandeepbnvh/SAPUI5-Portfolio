import JSONModel from "sap/ui/model/json/JSONModel";

declare const firebase: any;

function parseEnv(text: string): Record<string, string> {
    const env: Record<string, string> = {};
    text.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            const key = match[1];
            let value = match[2] || '';
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            } else if (value.startsWith("'") && value.endsWith("'")) {
                value = value.slice(1, -1);
            }
            env[key] = value;
        }
    });
    return env;
}

export function initializeFirebase(oModel: JSONModel): Promise<void> {
    return fetch(sap.ui.require.toUrl("com/san/portfolio/.env"))
        .then(response => response.text())
        .then(text => {
            const env = parseEnv(text);
            const firebaseConfig = {
                apiKey: env.FIREBASE_API_KEY,
                authDomain: env.FIREBASE_AUTH_DOMAIN,
                databaseURL: env.FIREBASE_DATABASE_URL,
                projectId: env.FIREBASE_PROJECT_ID,
                storageBucket: env.FIREBASE_STORAGE_BUCKET,
                messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
                appId: env.FIREBASE_APP_ID,
                measurementId: env.FIREBASE_MEASUREMENT_ID
            };
            firebase.initializeApp(firebaseConfig);
            
            const firestore = firebase.firestore();
            oModel.setProperty("/firestore", firestore);
            oModel.setProperty("/env", env);
        })
        .catch(err => {
            console.error("Failed to load or parse .env file: ", err);
        });
}
