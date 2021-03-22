import React, { useState } from "react"

// third party
import { Button, Form } from 'semantic-ui-react'

// project
import { api } from '../../api'
import { AxiosResponse } from "axios"
import { ILogin } from "./types"
import { IToken } from "../../types"
import { LoginStyled } from "./styles"
import { toast } from "react-toastify"


export const Login: React.FC<ILogin> = ({ onClose }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const validateForm = () =>
    email.length > 0 && password.length > 0

  const login = async (data: object) => {
    try {
      const response: AxiosResponse<IToken> = await api.post('token', data)

      if (response.status === 200) {
        if (response.data.access_token)
          localStorage.setItem('token', response.data.access_token)

        onClose()
      }
    } catch (error) {
      setEmail('')
      setPassword('')
      toast.error('Email ou senha incorretos')
    }
  }

  const onSubmit = () => {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)

    login(formData)
  }

  return (
    <LoginStyled>
      <Form onSubmit={ onSubmit }>
        <Form.Group inline>
          <Form.Field>
            <Form.Input
              label='Email'
              type='email'
              value={ email }
              onChange={ (e, { value }) => setEmail(value) } />
          </Form.Field>
        </Form.Group>
        <Form.Group inline>
          <Form.Field>
            <Form.Input
              label='Senha'
              type='password'
              value={ password }
              onChange={ (e, { value }) => setPassword(value) } />
          </Form.Field>
        </Form.Group>
        <Button color='blue' type='submit' disabled={ !validateForm() }>Login</Button>
      </Form>
    </LoginStyled>
  )
}
