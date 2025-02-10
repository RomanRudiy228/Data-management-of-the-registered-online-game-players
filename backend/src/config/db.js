const { MongoClient } = require('mongodb');

const url = "mongodb://localhost:27017";  
const client = new MongoClient(url);
let playersCollection;

async function connectToDB() {
    try {
        await client.connect();
        const database = client.db("Players");
        playersCollection = database.collection("Players");
        console.log("Database connection successful");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

module.exports = { connectToDB };
