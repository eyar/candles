import axios from 'axios'
import { IMonth } from '../interfaces';
import { averageObjects, setAverageLast } from '../calc-utils';

const coinbaseMonthly = async () => {
  const start = new Date()
  start.setDate(start.getDate() - 30)
  const startDate = start.toISOString()

  const url = `https://api.pro.coinbase.com/products/BTC-USDT/candles?start=${startDate}&granularity=86400`

  const { data }: { data: Array<Array<string>> } = await axios.get(url)

  const first30 = data.slice(0,30)

  const monthly = first30.reduce((acc: IMonth, [timestamp, low, high, open, close]) => {
    const time = new Date(+timestamp * 1000).toISOString()

    acc[time] = { time, low, high, open, close }

    return acc
  }, {})

  return monthly
}

const binanceMonthly = async () => {
  const url = `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30`

  const { data }: { data: Array<Array<string>> } = await axios.get(url)

  const monthly = data.reduce((acc: IMonth, daily) => {
    const [timestamp, open, high, low, close] = daily.map((string) => +string)

    const time = new Date(timestamp).toISOString()

    acc[time] = { time, low, high, open, close }

    return acc
  }, {})

  return monthly
}

export const getMonthlyData = async () => {
  const settled = await Promise.all([
    coinbaseMonthly(),
    binanceMonthly()
  ]);

  const [coinbaseResults, binanceResults] = settled

  const averages: IMonth = {}

  for(const key in binanceResults){
    if(coinbaseResults && key in coinbaseResults) averages[key] = averageObjects(coinbaseResults[key], binanceResults[key])
  }

  const values = Object.values(averages)

  const lastCandle = values[values.length - 1]

  setAverageLast(lastCandle)

  return values;
}