import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import Mutations from '../../../graphql/mutations';
import Queries from '../../../graphql/queries';
const { LOGOUT_USER } = Mutations;
const { IS_LOGGED_IN } = Queries;

const Logout = () => {
  let history = useHistory(); 

  const [ Logout ] = useMutation(LOGOUT_USER, {
    update(client, { data }) {
      client.writeQuery({
        query: IS_LOGGED_IN,
        data: {
          isLoggedIn: data.logoutUser.loggedIn,
        }
      })
    },
    onCompleted() {
      Cookies.set('auth-token', '')
      Cookies.set('currentUser', '')
      history.push('/')
    },
    onError(error) {
      console.log(error)
    }
  })

  return (
    <div>
      <button
        onClick={e => {
          e.preventDefault();
          Logout({ 
            variables: { 
              token: Cookies.get('auth-token')
            }
          })
        }}
      >
       Logout
      </button>
    </div>
  )
}

export default Logout;