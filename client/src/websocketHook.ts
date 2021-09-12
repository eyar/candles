import {ICandle, prepareCandles} from "./chart/prepareCandles";
import {useEffect, useRef, useState} from "react";

const url = 'ws://localhost:4000'

export const useWebsokcet = () => {
    const [chartReadyCandles, setChartReadyCandles] = useState([[]] as Array<Array<string | number>>)
    const [ticker, setTicker] = useState({} as ICandle)

    const webSocket = useRef<WebSocket | null>(null);

    useEffect(() => {
        webSocket.current = new WebSocket(url)

        webSocket.current.onmessage = function ({ data }) {
            const {candles, averageLast} = JSON.parse(data)

            const objectNonEmpty = averageLast && Object.keys(averageLast).length
            if (objectNonEmpty && averageLast) setTicker(averageLast)

            if (candles) {
                const preparedCandles = prepareCandles(candles)
                setChartReadyCandles(preparedCandles)
            }
        }
    }, [])

    return {chartReadyCandles, ticker}
}