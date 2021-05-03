import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import Mutations from '../../../../graphql/mutations.js';
const { UPDATE_USER_PASSWORD } = Mutations;

const Password = () => {
  let [active, setActive] = useState(false);
  let [currentPW, setCurrentPW] = useState('');
  let [newPassword, setNewPassword] = useState('');
  let [confNewPassword, setConfNewPassword] = useState('');
  let [errorMessage, setError] = useState(null)
  let [errorPWMessage, setPWError] = useState(null);
  let [alert, setAlert] = useState('')

  let [updateUserPassword] = useMutation(UPDATE_USER_PASSWORD, {
    onCompleted(data) {
      resetInputs()
      setAlert(alert = 'Password updated')
      setTimeout(() => {
        setAlert(alert = '')
      }, 5000)
      setActive(active = false)
    },
    onError(error) {
      setError(errorMessage = error.message)
    }
  })

  const resetInputs = () => {
    setCurrentPW(currentPW = '')
    setNewPassword(newPassword = '')
    setConfNewPassword(confNewPassword = '')
    setPWError(errorPWMessage = '')
    setError(errorMessage = '')
  }

  const renderConfirmPW = () => {
    if (newPassword) {
      return (
        <input
          type='password'
          placeholder='Confirm new password'
          value={confNewPassword}
          onChange={e => {
            setConfNewPassword(confNewPassword = e.target.value)
          }}
        />
      )
    }
  }

  if (active) {
    return (
      <div>
        <form
          onSubmit={e => {
            e.preventDefault()

            if (newPassword === confNewPassword) {
              updateUserPassword({
                variables: {
                  currentPW: currentPW,
                  newPassword: newPassword,
                  user: Cookies.get('currentUser')
                }
              })
            } else {
              setPWError(errorPWMessage = "Passwords don't match")
            }
          }}
        >
          <input
            type='password'
            placeholder='Current password'
            value={currentPW}
            onChange={e => {
              setCurrentPW(currentPW = e.target.value)
            }}
          />
          <p>{errorMessage ? `${errorMessage}` : ''}</p>
          <input
            type='password'
            placeholder='New password'
            value={newPassword}
            onChange={e => {
              setNewPassword(newPassword = e.target.value)
            }}
          />
          {renderConfirmPW()}
          <p>{errorPWMessage ? `${errorPWMessage}` : ''}</p>
          <div>
            <button
              type='button'
              onClick={() => {
                resetInputs()
                setActive(active = false)
              }}
            >Cancel</button>
            <button
              type='submit'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    )
  } else {
    return (
      <div>
        <p>{alert ? `${alert}` : ''}</p>
        <input
            type='password'
            disabled
            value={'password'}
          />
        <img
          className='editPostBtn'
          src="https://img.icons8.com/windows/32/000000/edit--v1.png"
          alt=''
          onClick={() => {
            setActive(active = true)
          }}
        />
      </div>
    )
  }
}

export default Password;