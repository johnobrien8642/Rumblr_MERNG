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
    onCompleted() {
      Cookies.set('auth-token', '')
      Cookies.set('currentUser', '')
    },
    update(client, data) {
      client.writeQuery({
        query: IS_LOGGED_IN,
        data: {
          isLoggedIn: data.data.logoutUser.loggedIn,
        }
      })
    }
  })

  return (
    <div>
      <button
        onClick={e => {
          const token = Cookies.get('auth-token')
          e.preventDefault();
          Logout({ variables: { token }})
            .then(() => history.push('/'))
            .catch(err => console.log(err))
        }}
      >
       Logout
      </button>
    </div>
  )
}

export default Logout;