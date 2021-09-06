import React, {useEffect, useRef, useState} from 'react';
import logo from './prycto-logo.png';
import './App.css';
import {ICandle, prepareCandles} from "./chart/prepareCandles";
import {CandleChart} from "./chart/chart";

const url = 'ws://localhost:4000'

function App() {
  const [chartReadyCandles, setChartReadyCandles] = useState([[]] as Array<Array<string | number>>)
  const [ticker, setTicker] = useState({} as ICandle)

  const webSocket = useRef<WebSocket | null>(null);

  useEffect(() => {
    webSocket.current = new WebSocket(url)

    webSocket.current.onmessage = function ({ data }) {
      const { candles, averageLast } = JSON.parse(data)

      if(averageLast) setTicker(averageLast)

      if(candles){
        const preparedCandles = prepareCandles(candles)
        setChartReadyCandles(preparedCandles)
      }
    }
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <h1>Coinbase/Binance averaged BTC-USDT Chart</h1>
        <h2>Price: 1 BTC = {ticker.price && Math.floor(ticker.price)} USDT</h2>
      </header>
      <CandleChart data={chartReadyCandles} ticker={ticker}/>
    </div>
  );
}

export default App;
