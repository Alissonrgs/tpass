import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// third party
import { AxiosResponse } from 'axios'
import {
  Dropdown,
  Header,
  Icon,
  Menu
} from 'semantic-ui-react'

// project
import { fetchCurrentUser } from './utils'
import { Login } from './login'
import { IUser } from '../../types'


const TopMenu: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<IUser | null>(null)

  const onOpen = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response: AxiosResponse<IUser> = await fetchCurrentUser()
        if (response.status === 200)
          setUser(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchUser()
  }, [open])

  return (
    <Menu attached='top' inverted borderless className='top-menu'>
      <Menu.Item as={ Link } to='/'>
        TPass Password Generator
      </Menu.Item>
      <Menu.Menu position='right'>
        <Dropdown
          button
          direction='left'
          floating
          item
          onOpen={ onOpen }
          pointing='top right'
          trigger={ <Icon name='user' /> }>
          {
            user ? (
              <Dropdown.Menu>
                <Dropdown.Header>
                  <Header as={ Link } to='/profile'>
                    <Header.Content>
                      { user.full_name || user.username }
                    </Header.Content>
                  </Header>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item
                  as='a'
                  href='#'
                  icon='user'
                  text='Perfil' />
                <Dropdown.Item
                  as='a'
                  href='#'
                  icon='sign-out'
                  text='Deslogar' />
              </Dropdown.Menu>
            ) : (
              <Dropdown.Menu open={ open }>
                <Login onClose={ onClose } />
              </Dropdown.Menu>
            )
          }
        </Dropdown>
      </Menu.Menu>
    </Menu>
  )
}

export default TopMenu