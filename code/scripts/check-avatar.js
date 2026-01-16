
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
let MONGO_URI = '';

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/MONGODB_URI=(.+)/);
    if (match) MONGO_URI = match[1].trim();
}

if (!MONGO_URI) {
    console.error("Could not find MONGODB_URI in .env.local");
    process.exit(1);
}

async function checkAvatar() {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db();
        // Since we don't have the UID easily, let's just list all users who have an avatar set (that is not default)
        // or just list the last updated user.
        
        const users = await db.collection('users').find({ avatar: { $exists: true, $ne: "" } }).sort({ updatedAt: -1 }).limit(5).toArray();
        
        console.log("Recent Users with Avatars:");
        users.forEach(u => {
            console.log(`User: ${u.userName}`);
            console.log(`Avatar URL: ${u.avatar}`);
            console.log("-------------------");
        });
        
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

checkAvatar();
