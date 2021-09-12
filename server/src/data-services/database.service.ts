import { MongoClient, Db, Collection, ObjectId } from 'mongodb'
import {getMonthlyData} from "./monthly-data";
import {setCandlesData} from "../websocket-server";
import {writeCandlesToDB} from "./data-utils";

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

export async function connectToDbAndWriteData() {
  try {
    await connectToDatabase()
  } catch (error) {
    console.error("Database connection failed", error)
    process.exit()
  }

  const fetchedMonthlyData = await getMonthlyData()

  setCandlesData(fetchedMonthlyData)

  writeCandlesToDB()
}