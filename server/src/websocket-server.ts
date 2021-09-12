import express from 'express';
import WebSocket, { Server } from 'ws'
import { calcAverage } from './calc-utils';
import {
  binanceRealTime,
  binanceWSConnection,
  coinbaseRealTime,
  coinbaseWSConnection
} from './data-services/real-time-data';
import {getMonthlyData} from "./data-services/monthly-data";
import {ILast} from "./interfaces";
import {sendCandlesData, writeCandlesToDB} from "./data-services/data-utils";

export let webSocket: WebSocket

export let monthlyData: ILast[]

export const setCandlesData = (newMonthlyData: ILast[]) => {
  monthlyData = newMonthlyData
}

export const startWSServer = () => {
  const PORT = 4000

  const server = express().listen(PORT, () => console.log(`Listening on ${PORT}`))

  const wss = new Server({ server })

  wss.on('connection', async (ws) => {
    console.log('Client connected')

    webSocket = ws

    const fetchedMonthlyData = await getMonthlyData()

    setCandlesData(fetchedMonthlyData)

    writeCandlesToDB()

    sendCandlesData()

    coinbaseRealTime()
    binanceRealTime()

    ws.on('close', () => {
      console.log('Client disconnected');

      if(wss.clients.size > 0) return

      binanceWSConnection.close()
      coinbaseWSConnection.close()
    })
  })

  setInterval(() => {
    if(wss.clients.size === 0) return

    const averageLast = calcAverage()

    console.log({averageLast})

    wss.clients.forEach( (client) => {
      client.send(JSON.stringify({ averageLast }))
    })
  }, 1000)

  setInterval(() => {
    if(wss.clients.size > 0) return

    try {
      binanceWSConnection.close()
      coinbaseWSConnection.close()
    } catch (err){}
  }, 1000)
}