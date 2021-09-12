import { binanceLast, coinbaseLast } from './data-services/real-time-data';
import {ILast} from "./interfaces";

export let averageLast = {} as ILast

export const averageObjects = (a: any, b: any) => {
  const c: any = {}

  for(const key in a){
    c[key] = (a[key] + b[key])/2
  }

  if('time' in a) c.time = new Date(a.time)

  return c;
}

export const setAverageLast = (last: ILast) => {
  averageLast = last
}

export function calcAverage(){
  const binancePrice = binanceLast.price
  const coinbasePrice = coinbaseLast.price

  const average = coinbasePrice && binancePrice && (coinbasePrice + binancePrice)/2

  if(!average) return

  if(averageLast.high < average) averageLast.high = average
  else if(averageLast.low > average) averageLast.low = average

  averageLast.price = average

  return averageLast
}