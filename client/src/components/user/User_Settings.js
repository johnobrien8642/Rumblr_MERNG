import React from 'react';
import { useHistory } from 'react-router-dom';
import EditProfilePic from './util/components/Edit_Profile_Pic';
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
      className='browserUserSettingsContainer'
    >
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
            src="https://img.icons8.com/windows/32/000000/long-arrow-left.png"
            alt=''
          />
        </div>
        <h1>Account</h1>
        <div
          className='editProfilePic'
        >
          <h3>Profile Picture</h3>
          <EditProfilePic user={user} />
        </div>

        <div
          className='editEmail'
        >
          <h3>Email</h3>
          <Email userEmail={user.email} />
        </div>

        <div
          className='editBlogDescription'
        >
          <h3>Blog Description</h3>
          <BlogDescription userBlogDescription={user.blogDescription} />
        </div>

        <div
          className='editPassword'
        >
          <h3>Password</h3>
          <Password user={user} />
        </div>

        <div
          className='filtering'
        >
          <h3>Filtering</h3>
          <Filtering user={user} />
        </div>

        <div
          className='deleteMyAcct'
        >
          <h3>Delete My Account</h3>
          <DeleteMyAccount />
        </div>
      </div>
    </div>
  )
}

export default UserSettings;