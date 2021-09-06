import { binanceLast, coinbaseLast } from './data-services/real-time-data';
import { ILast } from './interfaces';

export let averageLast = {} as ILast

export const averageObjects = (a: any, b: any) => {
  const c: any = {}

  for(const key in a){
    c[key] = (a[key] + b[key])/2
  }

  if('time' in a) c.time = new Date(a.time)

  return c;
}

export const calcAverage = () => {
  try{
    averageLast = averageObjects(binanceLast, coinbaseLast)
  }catch (err) {
    console.log(err)
  }

  console.log({ averageLast })

  return averageLast
}
