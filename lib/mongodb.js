import { MongoClient } from "mongodb";

//.env.local mein hum MongoDB ka actual connection address save karte hain.
// mongodb.js mein process.env.MONGODB_URI us address ko read karta hai.
// Phir uri variable mein woh address store ho jata hai.

const uri = process.env.MONGODB_URI;

// Iska matlab hai: .env.local file se database ka address read karo aur uri variable mein store kar do.

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

const client = new MongoClient(uri);

export default client;
