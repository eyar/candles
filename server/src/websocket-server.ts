import express from 'express';
import { Server } from 'ws'
import { calcAverage, sendMonthlyData, writeMonthlyData } from './utils';
import { binanceDaily, binanceWSConnection, coinbaseDaily, coinbaseWSConnection } from './data-services/real-time-data';


export const startWSServer = () => {
  const PORT = 4000

  const server = express().listen(PORT, () => console.log(`Listening on ${PORT}`))

  const wss = new Server({ server })

  wss.on('connection', async (ws) => {
    console.log('Client connected')
    console.log(wss.clients.size)

    writeMonthlyData()

    sendMonthlyData(ws)

    coinbaseDaily()
    binanceDaily()

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