// react
import React from 'react'

// project
import { TMain } from './styles'
import TopMenu from './top-menu'


const TMenu: React.FC = ({ children }) => {
	return (
    <TMain>
      <TopMenu />

      { children }

    </TMain>
	)
}

export default TMenu