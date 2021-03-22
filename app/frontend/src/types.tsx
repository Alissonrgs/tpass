export interface IError {
  detail: string
}

export interface IToken {
  access_token?: string
  token_type?: string
  detail?: string
}

export interface IUser {
  id: string,
  username: string,
  email: string,
  full_name: string,
  active: boolean
}