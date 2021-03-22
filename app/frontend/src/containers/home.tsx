import React, { useEffect, useState } from 'react'

// third party
import { AxiosResponse } from 'axios'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import crypto from 'crypto'
import {
  Header,
  Icon,
  Segment,
  Form,
  Checkbox,
  Button,
  Grid,
  Popup
} from 'semantic-ui-react'
import { DateTimeInput } from 'semantic-ui-calendar-react'

// project
import { api } from '../api'
import { Link } from 'react-router-dom'
import { password_generate, xorCrypt } from '../components/utils'
import { TPage } from './styles'


const Home: React.FC = () => {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(12)
  const [minLength, setMinLength] = useState(4)
  const [lowercase, setLowercase] = useState(1)
  const [uppercase, setUppercase] = useState(1)
  const [digits, setDigits] = useState(1)
  const [symbols, setSymbols] = useState(1)
  const [view, setView] = useState(3)
  const [cipher, setCipher] = useState('')
  const [expire, setExpire] = useState('')
  const [link, setLink] = useState('')

  const validateForm = () =>
    password.length > 0 && password.length > 0 && view > 0 && !isEmpty(expire)

  const passwordGenerate = () => {
    let validLength = lowercase + uppercase + digits + symbols

    if (validLength > 0 && length >= validLength)
      setPassword(password_generate(length, lowercase, uppercase, digits, symbols))
    else
      toast.warn('Não é possível gerar a senha com essas opções!')
  }

  const createPassword = async (data: object) => {
    try {
      const response: AxiosResponse = await api.post('passwords/create', data)

      if (response.status === 201) {
        setLink(`/passwords/${ response.data._id }`)
        toast.success('Senha registrada com sucesso')
      }
    } catch (error) {
      toast.error('Algo deu errado')
    }
  }

  const onSubmit = () => {
    let hashed_cipher: string|null = null
    let pwd_data = password

    if (!isEmpty(cipher)) { // encrypt password
      const hmac = crypto.createHmac('sha256', cipher)

      pwd_data = xorCrypt(pwd_data, cipher)
      hashed_cipher = hmac.digest('hex')
    }

    const data = {
      pwd: pwd_data,
      view: view,
      expire: expire,
      hashed_cipher: hashed_cipher}

    createPassword(data)
  }

  useEffect(() => {
    let validLength = lowercase + uppercase + digits + symbols
    if (minLength !== validLength) {
      setMinLength(validLength)
      if (length < validLength)
        setLength(validLength)
    }

    passwordGenerate()
  }, [length, lowercase, uppercase, digits, symbols])

  return (
    <TPage>
      <Segment textAlign='center'>
        <Header as='h1' icon>
          <Icon name='key' />
          Gere uma senha segura
          <Header.Subheader>
            Use seu gerador de senha para criar e compartilhar uma senha segura e aleatória
          </Header.Subheader>
        </Header>

        {
          !isEmpty(link) && (
            <Segment size='large'>
              <Link to={ link }>{ link }</Link>
            </Segment>
          )
        }

        <Form size='massive' onSubmit={ onSubmit }>
          <Form.Field width={ 16 }>
            <Form.Input
              action
              value={ password }
              onChange={ (e, { value }) => setPassword(value) }>
              <input />
              <Popup
                content='Copiar'
                trigger={
                  <Button
                  basic size='massive' type='button' icon='copy outline'
                  onClick={ () => navigator.clipboard.writeText(password) }/>
                } />
              <Popup
                content='Gerar'
                trigger={
                  <Button
                  basic size='massive' type='button' icon='sync alternate'
                  onClick={ passwordGenerate } />
                } />
            </Form.Input>
          </Form.Field>

          <Segment size='large'>
            <Header as='h2' dividing textAlign='center'>
              Personalize sua senha
            </Header>

            <Grid divided='vertically'>
              <Grid.Row columns={ 2 }>

                <Grid.Column>
                  <Form.Group grouped>
                    <Form.Field>
                      <Form.Input
                        label='Número de caracteres'
                        type='number'
                        min={ minLength }
                        value={ length }
                        onChange={ (e, { value }) => setLength(parseInt(value)) } />
                    </Form.Field>
                    {
                      lowercase > 0 && (
                        <Form.Field>
                          <Form.Input
                            label='Mínimo de minúsculas'
                            type='number'
                            value={ lowercase }
                            onChange={ (e, { value }) => setLowercase(parseInt(value)) } />
                        </Form.Field>
                      )
                    }
                    {
                      uppercase > 0 && (
                        <Form.Field>
                          <Form.Input
                            label='Mínimo de maiúsculas'
                            type='number'
                            value={ uppercase }
                            onChange={ (e, { value }) => setUppercase(parseInt(value)) } />
                        </Form.Field>
                      )
                    }
                    {
                      digits > 0 && (
                        <Form.Field>
                          <Form.Input
                            label='Mínimo de dígitos'
                            type='number'
                            value={ digits }
                            onChange={ (e, { value }) => setDigits(parseInt(value)) } />
                        </Form.Field>
                      )
                    }
                    {
                      symbols > 0 && (
                        <Form.Field>
                          <Form.Input
                            label='Mínimo de símbolos'
                            type='number'
                            value={ symbols }
                            onChange={ (e, { value }) => setSymbols(parseInt(value)) } />
                        </Form.Field>
                      )
                    }
                  </Form.Group>
                </Grid.Column>

                <Grid.Column>
                  <Form.Group widths='equal' grouped>
                    <Form.Field
                      control={ Checkbox }
                      toggle
                      label='LETRA MINÚSCULA'
                      checked={ lowercase > 0 ? true : false }
                      onChange={ () => setLowercase(lowercase ? 0 : 1) } />
                    <Form.Field
                      control={ Checkbox }
                      toggle
                      label='LETRA MAIÚSCULA'
                      checked={ uppercase > 0 ? true : false }
                      onChange={ () => setUppercase(uppercase ? 0 : 1) } />
                    <Form.Field
                      control={ Checkbox }
                      toggle
                      label='DÍGITOS'
                      checked={ digits > 0 ? true : false }
                      onChange={ () => setDigits(digits ? 0 : 1) } />
                    <Form.Field
                      control={ Checkbox }
                      toggle
                      label='SÍMBOLOS'
                      checked={ symbols > 0 ? true : false }
                      onChange={ () => setSymbols(symbols ? 0 : 1) } />
                  </Form.Group>
                </Grid.Column>

              </Grid.Row>
            </Grid>
          </Segment>

          <Segment size='large'>
            <Header as='h2' dividing textAlign='center'>
              Comnpartilhe sua senha
            </Header>

            <Form.Group widths='equal'>
              <Form.Field>
                <Form.Input
                  label='Limite de visualizações'
                  type='number'
                  value={ view }
                  onChange={ (e, { value }) => setView(parseInt(value)) } />
              </Form.Field>
              <DateTimeInput
                label='Data de expiração'
                dateFormat='YYYY-MM-DD'
                minDate={ new Date() }
                iconPosition="left"
                value={ expire }
                onChange={ (e, { value }) => setExpire(value) } />
              <Form.Field>
                <Form.Input
                  label='Chave de acesso'
                  type='password'
                  value={ cipher }
                  onChange={ (e, { value }) => setCipher(value) } />
              </Form.Field>
            </Form.Group>

            <Button color='blue' type='submit' disabled={ !validateForm() }>Compartilhar</Button>
          </Segment>
        </Form>
      </Segment>
    </TPage>
  )
}

export default Home