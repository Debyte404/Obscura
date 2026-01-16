
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Extract GEMINI_API_KEY from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
let API_KEY = '';

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/GEMINI_API_KEY=(.+)/);
    if (match) API_KEY = match[1].trim();
}

console.log("Using API Key:", API_KEY ? "Found" : "Not Found");

async function listModels() {
    if (!API_KEY) {
        console.error("API Key missing");
        return;
    }

    try {
        // We can't use GoogleGenerativeAI to list models directly easily in browser SDK? 
        // Actually the server SDK usually has a ModelManager.
        // Let's try to fetch via REST if SDK doesn't expose it easily or just use a known one.
        // But wait, GoogleGenerativeAI usually is for generateContent.
        // Let's try to just hit the API endpoint directly using fetch.
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                     console.log(`- ${m.name} (${m.displayName})`);
                }
            });
        } else {
            console.log("No models found or error:", data);
        }

    } catch (e) {
        console.error("Error listing models:", e);
    }
}

listModels();
