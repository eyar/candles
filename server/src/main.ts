import { connectToDatabase } from './data-services/database.service';
import {setCandlesData, startWSServer} from './websocket-server';
import {getMonthlyData} from "./data-services/monthly-data";
import {writeCandlesToDB} from "./data-services/data-utils";

connectToDatabase()
  .then( async () => {
      const fetchedMonthlyData = await getMonthlyData()

      setCandlesData(fetchedMonthlyData)

      writeCandlesToDB()
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error)
    process.exit()
  });

startWSServer()
;