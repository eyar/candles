import { connectToDatabase } from './database.service';
import { writeMonthlyData } from './utils';
import { startWSServer } from './websocket-server';

connectToDatabase()
  .then( () => writeMonthlyData() )
  .catch((error: Error) => {
    console.error("Database connection failed", error)
    process.exit()
  });

startWSServer()

