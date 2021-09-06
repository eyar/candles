export interface ILast {
  time?: string
  low: string | number
  high: string | number
  open: string | number
  close?: string | number
  price?: number
  updated?: Date
}

export interface IMonth {
  [key: string]: ILast
}
