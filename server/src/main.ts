import { connectToDatabase } from './database.service';
import { writeToDB } from './utils';
import { startWSServer } from './websocket-server';
import {getMonthlyData} from "./data-services/monthly-data";

connectToDatabase()
  .then( async () => {
      const monthlyData = await getMonthlyData()

      writeToDB(monthlyData)
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error)
    process.exit()
  });

startWSServer()
;