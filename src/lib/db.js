import { MongoClient } from 'mongodb';
import { ServerApiVersion } from 'mongodb';

if (!process.env.DB_URI) {
    throw new Error('Mongo URI not found!');
}

const client = new MongoClient(process.env.DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // serverSelectionTimeoutMS: 5000, // Optional: timeout for server selection
    // connectTimeoutMS: 10000, // Optional: timeout for connection
});

async function getDB(dbName) {
    try {
        await client.connect();
        console.log('>>> Connected to MongoDB <<<');
        return client.db(dbName);
    } catch (err) {
        console.log(err);
    }
}

export async function getCollection(collectionName) {
    const db = await getDB('next_blog_db');
    if (db) return db.collection(collectionName);
    
    return null;
}