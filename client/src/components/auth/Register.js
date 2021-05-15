import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory, Link } from 'react-router-dom';
import Mutations from '../../graphql/mutations';
import Queries from '../../graphql/queries';
import Cookies from 'js-cookie';
const { REGISTER_USER } = Mutations;
const { IS_LOGGED_IN } = Queries;


const Register = () => {
  let [email, setEmail] = useState('');
  let [blogName, setBlogName] = useState('');
  let [blogDescription, setBlogDescription] = useState('');
  let [password, setPassword] = useState('');
  let [errorMessages, addErrorMessage] = useState([]);
  let history = useHistory();

  const [ registerUser ] = useMutation(REGISTER_USER, {
    onError(error) {
      if(error.message === 'Account already exists with that email') {
        history.push({
          pathname: '/login',
          state: {
            errMessage: error.message
          }
        })
      } else { 
        error.graphQLErrors.forEach((error, i) => {
          addErrorMessage(errorMessages.concat(error.message))
        })
      }
    },
    onCompleted({ registerUser }) {
      const { token, blogName } = registerUser;
      Cookies.set('auth-token', token)
      Cookies.set('currentUser', blogName)
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
    <div
      className='registerForm'
    >
      <div
        className='greetingHeader'
      >
        <h1>Rumblr</h1>
      </div>

        <form
          onSubmit={e => {
            e.preventDefault();
            registerUser({ 
              variables: {
                email: email, 
                blogName: blogName,
                password: password,
                blogDescription: blogDescription
              }
            })
          }}
        >

        <ul>
          {errorMessages.map((error, i) => {
            return <li key={i}>{error}</li>
          })}
        </ul>

        <input
          type='text'
          value={email}
          placeholder={'Email'}
          onChange={e => setEmail(email = e.target.value)}
        />
        <input
          type='text'
          value={blogName}
          placeholder={'Blog Name'}
          onChange={e => setBlogName(blogName = e.target.value)}
        />
        <textarea
          value={blogDescription}
          placeholder={'Blog description'}
          onChange={e => setBlogDescription(blogDescription = e.target.value)}
        ></textarea>

        <input
          type='password'
          value={password}
          placeholder={'Password'}
          onChange={e => setPassword(password = e.target.value)}
        />

        <button 
          type='submit'
        >
          Sign up
        </button>

        <Link
          to='/login'
        >
          Already have an account? Log in!
        </Link>
      </form>
    </div>
  )
}

export default Register;