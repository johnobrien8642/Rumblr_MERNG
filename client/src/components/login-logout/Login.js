import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Mutations from '../../graphql/mutations'
import Queries from '../../graphql/queries'
const { LOGIN_USER } = Mutations;
const { IS_LOGGED_IN } = Queries;

const Login = () => {
  let [ email, setEmail ] = useState('');
  let [ password, setPassword ] = useState('');
  let [ errorMessages, addErrorMessage ] = useState([]);

  let history = useHistory();

  const [ loginUser ] = useMutation(LOGIN_USER, {
    onError(error) {
      error.graphQLErrors.forEach((error, i) => {
        addErrorMessage(errorMessages.concat(error.message))
      })
    },
    onCompleted({ loginUser }) {
      const { token } = loginUser;
      localStorage.setItem('auth-token', token)
      resetInputs();
      history.push('/')
    },
    update(client, { data }) {
      client.writeQuery({
        query: IS_LOGGED_IN,
        data: {
          isLoggedIn: data.loginUser.loggedIn,
        }
      })
    }
  })
  
  const resetInputs = () => {
    setEmail(email = '');
    setPassword(password = '');
    addErrorMessage(errorMessages = []);
  }

  return (
    <div>
      <ul>
        {errorMessages.map((error, i) => {
          return <li key={i}>{error}</li>
        })}
      </ul>
      <form
        onSubmit={e => {
          e.preventDefault();
          loginUser({variables: { email, password }})
        }}
      >
        <input
          type='text'
          value={email}
          placeholder={'Email'}
          onChange={e => setEmail(email = e.target.value)}
        />
        <input
          type='text'
          value={password}
          placeholder={'Password'}
          onChange={e => setPassword(password = e.target.value)}
        />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default Login;
