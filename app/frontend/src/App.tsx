import React from 'react'
import { Redirect, Switch } from 'react-router-dom'

// third party
import { map } from 'lodash'

// project
import { TPage } from './components/app/styles'
import rootRoutes from './routes/route'
import RouteWithSubRoutes from './components/common/route-with-sub-routes'
import TMenu from './components/app/tmenu'


const App: React.FC = () => {
  return (
    <TMenu>
      <TPage>
        <Switch>
          {
            map(rootRoutes, (route, index) => (
              <RouteWithSubRoutes key={ index } { ...route } />
            ))
          }
          <Redirect from='*' to='/' />
        </Switch>
      </TPage>
    </TMenu>
  )
}

export default App