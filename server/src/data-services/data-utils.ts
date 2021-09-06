import {monthlyData, setCandlesData, webSocket} from "../websocket-server";
import {collections} from "./database.service";
import {getMonthlyData} from "./monthly-data";

export const writeCandlesToDB = async () => {
    const candlesBulkUpdate = monthlyData.map((candle) => {
        candle.updated = new Date()

        return {
            replaceOne: {
                filter: { time: candle.time },
                replacement: candle,
                upsert: true
            }
        }
    })

    collections.candles?.bulkWrite(candlesBulkUpdate).catch(e => {
        console.log(e);
    });
}

export const sendCandlesData = async () => {
    try {
        const date30days = new Date()
        date30days.setDate(date30days.getDate() - 30)

        const candles = await collections.candles?.find({ time: { '$gte': date30days } }).toArray()

        webSocket.send(JSON.stringify({ candles }))
    }catch (err) {
        console.log(err)
    }
}

export const getAndSendCandles = async () => {
    const fetchedMonthlyData = await getMonthlyData()

    setCandlesData(fetchedMonthlyData)

    writeCandlesToDB()

    sendCandlesData()
}