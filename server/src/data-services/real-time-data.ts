import { ILast } from '../interfaces';
import {getAndSendCandles} from "./data-utils";
const WebSocket = require('ws');

export const binanceLast = {} as ILast
export const coinbaseLast = {} as ILast

export let binanceWSConnection: WebSocket
export let coinbaseWSConnection: WebSocket

let lastOpenTime = ''

export const coinbaseRealTime = () => {
  const url = `wss://ws-feed.pro.coinbase.com`

  coinbaseWSConnection = new WebSocket(url)

  if(coinbaseWSConnection) {
    coinbaseWSConnection.onopen = () => {
      const payload = {
        "type": "subscribe",
        "product_ids": [
          "BTC-USDT"
        ],
        "channels": [
          "ticker",
          {
            "name": "ticker",
            "product_ids": [
              "BTC-USDT"
            ]
          }
        ]
      }

      try {
        coinbaseWSConnection.send(JSON.stringify(payload))
      } catch (e) {
        const { readyState } = coinbaseWSConnection
        console.log({ readyState })
      }
    }

    coinbaseWSConnection.onmessage = ({ data }: { data: string} ) => {
      const { price, open_24h, low_24h, high_24h } = JSON.parse(data)

      coinbaseLast.price = +price
      coinbaseLast.open = +open_24h
      coinbaseLast.low = +low_24h
      coinbaseLast.high = +high_24h

      console.log({ coinbaseLast })
    }

    coinbaseWSConnection.onerror = (error: any) => {
      console.log(`Coinbase WebSocket error: ${error}`)
    }
  }
}

export const binanceRealTime = () => {
  const url = 'wss://stream.binance.com:9443/ws/btcusdt@kline_1d'

  binanceWSConnection = new WebSocket(url)

  if(binanceWSConnection) {
    binanceWSConnection.onmessage = async ({ data }: { data: string} ) => {
      const { k: { t, c, o, h, l }} = JSON.parse(data)

      if(t !== '' && t !== lastOpenTime) {
        lastOpenTime = t
        getAndSendCandles()
      }

      binanceLast.price = +c
      binanceLast.open = +o
      binanceLast.high = +h
      binanceLast.low = +l

      console.log({ binanceLast })
    }

    binanceWSConnection.onerror = (error: any) => {
      console.log(`Binance WebSocket error: ${error.message}`)
    }
  }
}

