import React from 'react'
import { useIdleTimer } from 'react-idle-timer'
import App from './App'
// import "./App.css"
// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/authentication'
export default function (props) {
  // ** Store Vars
  const dispatch = useDispatch()
  const handleOnIdle = event => {
    dispatch(handleLogout())
    // window.location.reload()
  }

  const handleOnActive = event => {
    // console.log('user is active', event)
    // console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = event => {
    // console.log('user did something', event)
    const currentTime = new Date().getTime()
    if (localStorage.getItem('storagetime') && (currentTime - parseInt(localStorage.getItem('storagetime'))) > 1000 * 60 * 30 * 10) {
      dispatch(handleLogout())
      // window.location.reload()
    } else {
      localStorage.setItem('storagetime', currentTime)
    }
  }

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 30,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500
  })

  return (
    <App />
  )
}
