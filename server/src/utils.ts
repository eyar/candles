import { getMonthlyData } from './data-services/monthly-data';
import { collections } from './database.service';
import WebSocket from 'ws';
import { binanceLast, coinbaseLast } from './data-services/real-time-data';
import { ILast } from './interfaces';

export let averageLast = {} as ILast

export const averageObjects = (a: any, b: any) => {
  const c: any = {}

  for(const key in a){
    c[key] = (a[key] + b[key])/2
  }

  if('time' in a) c.time = new Date(a.time)

  return c;
}

export const writeToDB = async (monthlyData: ILast[]) => {
  monthlyData.reverse()

  try {
    const result = await collections.candles?.insertMany(monthlyData)
    console.log(result)
  } catch (err) {
    console.log("Error writing to DB, you're probably trying to overwrite existing candles")
  }
}

export const sendMonthlyData = async (ws: WebSocket) => {
  try {
    const date30days = new Date()
    date30days.setDate(date30days.getDate() - 30)

    const candles = await collections.candles?.find({ time: { '$gte': date30days } }).toArray()

    ws.send(JSON.stringify({ candles }))
  }catch (err) {
    console.log(err)
  }
}

export const calcAverage = () => {
  try{
    averageLast = averageObjects(binanceLast, coinbaseLast)
  }catch (err) {
    console.log(err)
  }

  console.log({ averageLast })

  return averageLast
}
