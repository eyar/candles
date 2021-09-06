import { MongoClient, Db, Collection, ObjectId } from 'mongodb'

export const collections: { candles?: Collection } = {}

export async function connectToDatabase () {
  const client: MongoClient = new MongoClient('mongodb+srv://admin:strongpass1234@cluster0.y6kl3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

  await client.connect()

  const db: Db = client.db('candlesDB')

  const candlesCollection: Collection = db.collection('candles')

  await candlesCollection.createIndex({ time: 1 }, { unique: true })

  collections.candles = candlesCollection

  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${candlesCollection.collectionName}`)
}