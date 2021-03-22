// react
import React from 'react'
import { Route } from 'react-router-dom'

// project
import { IRoute } from '../../routes/types'


const RouteWithSubRoutes: React.FC<IRoute> = (route) => {
  return (
    <Route
      path={ route.path }
      exact={ route.exact }
      render={ props => <route.component { ...props } routes={ route.routes } /> } />
  )
}

export default RouteWithSubRoutes