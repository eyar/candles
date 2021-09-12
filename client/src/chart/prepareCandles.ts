export interface ICandle {
    time: string
    low: number
    high: number
    open: number
    close: number
    price?: number
}

export const prepareCandles = (data: Array<ICandle>) => {
    let chartReady = data.map( ({ time, low, high, close, open}) => {
        const date = time.substr(5,5)

        return [date, Math.round(low), Math.round(open), Math.round(close), Math.round(high)]
    })

    chartReady = [['day', 'a', 'b', 'c', 'd'], ...chartReady]

    return chartReady
}