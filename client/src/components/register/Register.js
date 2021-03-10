import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../graphql/mutations';
import Queries from '../../graphql/queries';
const { REGISTER_USER } = Mutations;
const { IS_LOGGED_IN } = Queries;


const Register = () => {
  let [email, setEmail] = useState('');
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  let history = useHistory();

  const [ registerUser ] = useMutation(REGISTER_USER, {
    onCompleted({ registerUser }) {
      const { token } = registerUser;
      localStorage.setItem('auth-token', token)
      resetInputs();
    },
    update(client, { data }) {
      client.writeQuery({
        query: IS_LOGGED_IN,
        data: {
          isLoggedIn: data.registerUser.loggedIn,
        }
      })
    }
  })

  const resetInputs = () => {
    setEmail(email = '');
    setUsername(username = '');
    setPassword(password = '');
  }

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          registerUser({ variables: { email, username, password }})
            .then(() => history.push('/'))
            .catch(err => console.log(err))
        }}
      >
      <input
        value={email}
        placeholder={'Email'}
        onChange={e => setEmail(email = e.target.value)}
      />
      <input
        value={username}
        placeholder={'Username'}
        onChange={e => setUsername(username = e.target.value)}
      />
      <input
        value={password}
        placeholder={'Password'}
        onChange={e => setPassword(password = e.target.value)}
      />
      <button type='submit'>Sign Up</button>
      </form>
    </div>
  )
}

export default Register;