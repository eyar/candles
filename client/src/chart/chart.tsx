import {Chart} from "react-google-charts";
import React from "react";
import {ICandle} from "./prepareCandles";

export function CandleChart({data, ticker}: { data: Array<Array<string | number>>, ticker: ICandle }) {
    const date = data[data.length - 1][0]

    const { low, open, price, high } = ticker

    const lastCandle = [date, Math.floor(low), Math.floor(open), price && Math.floor(price), Math.floor(high)]

    const candlesWithUpdatedPrice = date ? [...data.slice(0,data.length - 1), lastCandle] : data

    return (
        date ? <Chart
            width={'100%'}
            height={700}
            chartType="CandlestickChart"
            loader={<div>Loading Chart</div>}
            data={candlesWithUpdatedPrice}
            options={{
                legend: 'none',
                bar: { groupWidth: '100%' }, // Remove space between bars.
                candlestick: {
                    fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
                    risingColor: { strokeWidth: 0, fill: '#0f9d58' }, // green
                },
            }}
            rootProps={{ 'data-testid': '2' }}
        /> : null
    )
}