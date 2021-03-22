import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter,
  Route
} from 'react-router-dom'

// third party
import { ToastContainer, Slide } from 'react-toastify'

// project
import App from './App'

// styles
import 'react-toastify/dist/ReactToastify.css'
import 'semantic-ui-css/semantic.min.css'


ReactDOM.render(
  <>
    <ToastContainer
      autoClose={ 5000 }
      closeOnClick
      draggable={ false }
      hideProgressBar
      newestOnTop
      pauseOnHover
      position='bottom-right'
      rtl={ false }
      transition={ Slide } />

    <BrowserRouter>
      <Route path='/' component={ App } />
    </BrowserRouter>
  </>,
  document.getElementById('root'))