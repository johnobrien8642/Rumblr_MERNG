import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../graphql/mutations';
import Queries from '../../graphql/queries';
const { REGISTER_USER } = Mutations;
const { IS_LOGGED_IN } = Queries;


const Register = () => {
  let [email, setEmail] = useState('');
  let [blogName, setBlogName] = useState('');
  let [password, setPassword] = useState('');
  let [errorMessages, addErrorMessage] = useState([]);
  let history = useHistory();

  const [ registerUser ] = useMutation(REGISTER_USER, {
    onError(error) {
      error.graphQLErrors.forEach((error, i) => {
        addErrorMessage(errorMessages.concat(error.message))
      })
    },
    onCompleted({ registerUser }) {
      const { token } = registerUser;
      localStorage.setItem('auth-token', token)
      resetInputs();
      history.push('/');
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
    setBlogName(blogName = '');
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
          registerUser({ 
            variables: { 
              NewUserInput: { 
                email, 
                blogName, 
                password 
              }
            }
          })
        }}
      >
      <input
        value={email}
        placeholder={'Email'}
        onChange={e => setEmail(email = e.target.value)}
      />
      <input
        value={blogName}
        placeholder={'Blog Name'}
        onChange={e => setBlogName(blogName = e.target.value)}
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