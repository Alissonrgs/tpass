// project
import { IRoute } from './types'
import Home from '../containers/home'
import PasswordDetail from '../containers/password'


const rootRoutes: IRoute[] = [
  {
    component: Home,
    exact: true,
    path: '/',
    routes: []
  },
  // {
  //   component: PasswordList,
  //   exact: true,
  //   path: '/passwords/',
  //   routes: []
  // },
  {
    component: PasswordDetail,
    exact: true,
    path: '/passwords/:pwd_id',
    routes: []
  }
]

export default rootRoutes