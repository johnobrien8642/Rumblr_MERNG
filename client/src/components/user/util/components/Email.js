import React, { useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import UserSettingUtil from '../functions/user_setting_util.js'
import Queries from '../../../../graphql/queries.js';
import Mutations from '../../../../graphql/mutations.js';
const { FETCH_USER } = Queries;
const { UPDATE_USER_EMAIL } = Mutations;
const { updateCacheUpdateEmail } = UserSettingUtil;

const Email = ({
  userEmail
}) => {
  let emailRef = useRef(userEmail)
  let [active, setActive] = useState(false);
  let [email, setEmail] = useState(userEmail);
  let [password, setPassword] = useState('');
  let [errorMessage, setError] = useState(null);

  let [updateUserEmail] = useMutation(UPDATE_USER_EMAIL, {
    update(client, { data }) {
      const { updateUserEmail } = data;
      var currentUser = Cookies.get('currentUser')
      var query = FETCH_USER
      
      updateCacheUpdateEmail(client, updateUserEmail, currentUser, query)
    },
    onCompleted(data) {
      emailRef.current = data.updateUserEmail.email
      resetInputs()
      setActive(active = false)
    },
    onError(error) {
      setError(errorMessage = error.message)
    }
  })

  const resetInputs = () => {
    setEmail(email = '')
    setPassword(password = '')
    setError(errorMessage = '')
  }

  if (active) {
    return (
      <div>
        <form
          onSubmit={e => {
            e.preventDefault()

            updateUserEmail({
              variables: {
                email: email,
                password: password,
                user: Cookies.get('currentUser')
              }
            })
          }}
        >
          <input
            type='text'
            value={email}
            onChange={e => {
              setEmail(email = e.target.value)
            }}
          />
          <p>{errorMessage ? `${errorMessage}` : ''}</p>
          <input
            type='password'
            placeholder='Confirm password'
            value={password}
            onChange={e => {
              setPassword(password = e.target.value)
            }}
          />
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
            >Save</button>
          </div>
        </form>
      </div>
    )
  } else {
    return (
      <div>
        <p>{emailRef.current}</p>
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

export default Email;