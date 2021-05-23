import React from 'react';
import { useHistory } from 'react-router-dom';
import Email from './util/components/Email';
import BlogDescription from './util/components/Blog_Description';
import Password from './util/components/Password';
import Filtering from './util/components/Filtering';
import DeleteMyAccount from './util/components/Delete_My_Account';
import Cookies from 'js-cookie';
import { useQuery } from '@apollo/client';
import Queries from '../../graphql/queries.js';
const { FETCH_USER } = Queries;

const UserSettings = () => {
  let history = useHistory();
  
  let { loading, error, data } = useQuery(FETCH_USER, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  const { user } = data
  
  return (
    <div
      className='browserUserSettings'
    >
      <div
        className='backBtn'
        onClick={() => {
          history.push('/dashboard')
        }}
      >
        <img
          src="https://img.icons8.com/metro/26/000000/edit.png"
          alt=''
        />
      </div>
      <h3>Email</h3>
      <Email userEmail={user.email} />
      <h3>Blog Description</h3>
      <BlogDescription userBlogDescription={user.blogDescription} />
      <h3>Password</h3>
      <Password user={user} />
      <h3>Filtering</h3>
      <Filtering user={user} />
      <h3>Delete My Account</h3>
      <DeleteMyAccount />
    </div>
  )
}

export default UserSettings;