export interface IPWD {
  _id: string
  created: Date
  pwd: string
  view: number
  expire: Date
  hashed_cipher: string
}