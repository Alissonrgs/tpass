// project
import { api } from "../../api"


export const fetchCurrentUser = () => {
  let api_config = {
    headers: {}}
  const token = localStorage.getItem('token')

  if (!token)
    return api.get('users/current')

  api_config.headers['Authorization'] = `Bearer ${token}`
  return api.get('users/current', api_config)
}