import React, { useEffect, useState } from 'react'

// third party
import { AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import crypto from 'crypto'
import {
  Header,
  Icon,
  Segment,
  Table,
  Modal,
  Button,
  Form
} from 'semantic-ui-react'

// project
import { api } from '../api'
import { IPWD } from './types'
import { Link, useParams } from 'react-router-dom'
import { xorCrypt } from '../components/utils'
import { TPage } from './styles'
import { isNull } from 'lodash'


const PasswordDetail: React.FC = () => {
  const [pwd, setPwd] = useState<IPWD | null>(null)
  const [viewPwd, setViewPwd] = useState('')
  const [open, setOpen] = useState(false)
  const [cipher, setCipher] = useState('')

  // hooks
  const params: any = useParams()

  const fetchPassword = async () => {
    try {
      const response: AxiosResponse = await api.get(`passwords/${ params.pwd_id }`)

      if (response.status === 200)
        setPwd(response.data)
    } catch (error) {
    }
  }

  const decryptPassword = () => {
    if (!isNull(pwd)) {
      const hmac = crypto.createHmac('sha256', cipher)

      if (pwd.hashed_cipher === hmac.digest('hex'))
        setViewPwd(xorCrypt(pwd.pwd, cipher))
      else
        toast.error('Chave incorreta')
    }

    setOpen(false)
  }

  useEffect(() => {
    if (isNull(pwd))
      fetchPassword()
    else if (isNull(pwd.hashed_cipher))
      setViewPwd(pwd.pwd)
  }, [pwd])

  return (
    <TPage>
      <Modal
        size='mini'
        open={ open }
        onClose={ () => setOpen(false) }>
        <Modal.Header>Visualizar Senha</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Form.Input
                label='Chave de acesso'
                action
                value={ cipher }
                onChange={ (e, { value }) => setCipher(value) } />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={ () => setOpen(false) }>
            Cancelar
          </Button>
          <Button positive onClick={ () => decryptPassword() }>
            Visualizar
          </Button>
        </Modal.Actions>
      </Modal>

      <Segment textAlign='center' size='large'>
        {
          pwd ? (
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Link</Table.Cell>
                  <Table.Cell>
                    <Link to={ `/passwords/${pwd._id}` }>/passwords/{ pwd._id }</Link>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Criada em</Table.Cell>
                  <Table.Cell>{ pwd.created }</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Senha</Table.Cell>
                  <Table.Cell>
                    {
                      viewPwd ? (
                        viewPwd
                      ) : (
                        <Button onClick={ () => setOpen(true) }>
                          Visualizar Senha
                        </Button>
                      )
                    }
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Visualizações Restantes</Table.Cell>
                  <Table.Cell>{ pwd.view }</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Data de Expiração</Table.Cell>
                  <Table.Cell>{ pwd.expire }</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          ) : (
            <Header as='h1' icon>
              <Icon name='key' />
              Senha não encontrada ou expirada!
            </Header>
          )
        }
      </Segment>
    </TPage>
  )
}

export default PasswordDetail