import React from 'react';
import logo from './prycto-logo.png';
import './App.css';
import {CandleChart} from "./chart/chart";
import {useWebsokcet} from "./websocketHook";

function App() {
  const {chartReadyCandles, ticker} = useWebsokcet()

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
