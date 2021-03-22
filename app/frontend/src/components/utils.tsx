import { includes, map } from "lodash"

const ascii_lowercase = 'abcdefghijklmnopqrstuvwxyz'
const ascii_uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ascii_digits = '0123456789'
const ascii_symbols = "!#$%&'()*+,-.:;<=>?@[]^_`{|}~"


const randomChoice = (arr: string) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const password_generate = (
  length: number = 12,
  lower_min: number = 1,
  upper_min: number = 1,
  digits_min: number = 1,
  symbols_min: number = 1
) => {
  let charts = ''
  let password = ''
  let lower_count = 0
  let upper_count = 0
  let digits_count = 0
  let symbols_count = 0

  if (lower_min > 0)
    charts += ascii_lowercase
  if (upper_min > 0)
    charts += ascii_uppercase
  if (digits_min > 0)
    charts += ascii_digits
  if (symbols_min > 0)
    charts += ascii_symbols

  for (let i = 0; i < length; i++) {
    const letter = randomChoice(charts)

    if (includes(ascii_lowercase, letter))
      lower_count += 1
    else if (includes(ascii_uppercase, letter))
      upper_count += 1
    else if (includes(ascii_digits, letter))
      digits_count += 1
    else if (includes(ascii_symbols, letter))
      symbols_count += 1

    password += letter
  }

  if (lower_count < lower_min || upper_count < upper_min || digits_count < digits_min || symbols_count < symbols_min)
    return password_generate(length, lower_min, upper_min, digits_min, symbols_min)

  return password
}

const keyCharAt = (key: string, i: number) => key.charCodeAt(i % key.length)

export const xorCrypt = (data: string, cipher: string) =>
  map(data, (c, i) => {
    return String.fromCharCode(c.charCodeAt(0) ^ keyCharAt(cipher, i))
  }).join("")