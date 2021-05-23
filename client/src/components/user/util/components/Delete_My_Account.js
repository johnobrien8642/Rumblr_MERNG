import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../../../graphql/mutations.js';
const { DELETE_MY_ACCOUNT } = Mutations;

const DeleteMyAccount = () => {
  let [active, setActive] = useState(false);
  let [password, setPassword] = useState('');
  let [askToConfirm, confirmDelete] = useState(false)
  let [errorMessage, setError] = useState(null)
  let history = useHistory();

  let [deleteMyAccount] = useMutation(DELETE_MY_ACCOUNT, {
    onCompleted(data) {
      resetInputs()
      setActive(active = false)
      history.push('/')
    },
    onError(error) {
      setError(errorMessage = error.message)
    }
  })

  const resetInputs = () => {
    setPassword(password = '')
    confirmDelete(askToConfirm = false)
    setError(errorMessage = '')
  }

  if (active) {
    return (
      <div
        className='deleteMyAcct'
      >
        <input
          type='password'
          placeholder='Confirm password...'
          value={password}
          onChange={e => {
            setPassword(password = e.target.value)
          }}
        />
  
        <p>{errorMessage ? `${errorMessage}` : ''}</p>
  
        <div>
          <button
            type='button'
            onClick={() => {
              if (password) {
                setActive(active = false)
                confirmDelete(askToConfirm = true)
              } else {
                setError(errorMessage = 'You must enter your password')
              }
            }}
          >
            Delete My Account
          </button>
          <button
            type='button'
            onClick={() => {
              setActive(active = false)
            }}          
          >
            Cancel
          </button>
        </div>
      </div>
    )
  } else if (askToConfirm) {
    return (
      <div
        className='deleteMyAcct'
      >
        <button
          onClick={() => {
            deleteMyAccount({
              variables: {
                password: password,
                query: Cookies.get('currentUser'),
                token: Cookies.get('auth-token')
              }
            })
          }}
        >
          Delete my account (This action cannot be undone)
        </button>
        <button
          type='button'
          onClick={() => {
            setPassword(password = '')
            confirmDelete(askToConfirm = false)
            setActive(active = false)
          }}
        >
          Cancel
        </button>
      </div>
    )
  } else {
    return (
      <div
        className='deleteMyAcct'
      >
        <button
          onClick={() => {
            setActive(active = true)
            confirmDelete(askToConfirm = true)
          }}
        >
          Delete My Account
        </button>
      </div>
    )
  }
}

export default DeleteMyAccount;