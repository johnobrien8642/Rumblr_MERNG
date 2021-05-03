import React from 'react';
import Email from './util/components/Email';
import Password from './util/components/Password';
import Filtering from './util/components/Filtering';
import Cookies from 'js-cookie';
import { useQuery } from '@apollo/client';
import Queries from '../../graphql/queries.js';
const { FETCH_USER } = Queries;


const UserSettings = () => {
  
  let { loading, error, data } = useQuery(FETCH_USER, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  const { user } = data

  return (
    <div>
      <h3>Email</h3>
      <Email userEmail={user.email} />
      <h3>Password</h3>
      <Password user={user} />
      <h3>Filtering</h3>
      <Filtering user={user} />
    </div>
  )
}

export default UserSettings;