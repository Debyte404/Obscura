
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Extract MONGO_URI from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
let MONGO_URI = '';

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/MONGODB_URI=(.+)/);
    if (match) MONGO_URI = match[1].trim();
}

if (!MONGO_URI) {
    console.error("Could not find MONGO_URI in .env.local");
    process.exit(1);
}

const dummyUsers = [
    {
        uid: "dummy1",
        email: "dummy1@example.com",
        userName: "Alice_Wonder",
        firstName: "Alice",
        collegeYear: "1st",
        homeState: "Maharashtra",
        language: "English",
        gender: "Female",
        introduction: "I love coding and painting. Looking for someone to chat about tech.",
        preference: "Someone who likes tech and art.",
        tags: ["Coding", "Art", "Music", "Travel", "Food"],
        isOnline: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        uid: "dummy2",
        email: "dummy2@example.com",
        userName: "Bob_Builder",
        firstName: "Bob",
        collegeYear: "2nd",
        homeState: "Delhi",
        language: "Hindi",
        gender: "Male",
        introduction: "Mechanical engineering student. Love building things.",
        preference: "Chill vibes only.",
        tags: ["Engineering", "DIY", "Movies", "Gym", "Gaming"],
        isOnline: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        uid: "dummy3",
        email: "dummy3@example.com",
        userName: "Charlie_Chaplin",
        firstName: "Charlie",
        collegeYear: "3rd",
        homeState: "Karnataka",
        language: "English",
        gender: "Male",
        introduction: "Comedy fan and aspiring filmmaker. Let's discuss movies!",
        preference: "Creative people.",
        tags: ["Movies", "Comedy", "Filmmaking", "Photography", "Reading"],
        isOnline: false,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        uid: "dummy4",
        email: "dummy4@example.com",
        userName: "Diana_Prince",
        firstName: "Diana",
        collegeYear: "4th",
        homeState: "Maharashtra",
        language: "English",
        gender: "Female",
        introduction: "Final year student. Stressed but blessed. Love coffee.",
        preference: "Coffee buddies.",
        tags: ["Coffee", "Study", "Music", "Fashion", "Netflix"],
        isOnline: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

async function seed() {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db();
        const users = db.collection('users');

        for (const user of dummyUsers) {
            await users.updateOne(
                { uid: user.uid },
                { $set: user },
                { upsert: true }
            );
            console.log(`Seeded user: ${user.userName}`);
        }
        console.log("Seeding complete!");
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

seed();
