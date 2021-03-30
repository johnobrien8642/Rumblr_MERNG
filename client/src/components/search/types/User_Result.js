import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Mutations from '../../../graphql/mutations';
import Cookies from 'js-cookie';
const { FOLLOW_USER } = Mutations;

const UserResult = ({ user }) => {
  let [followed, setFollowed] = useState(false)

  let [followUser] = useMutation(FOLLOW_USER, {
    onCompleted() {
      setFollowed(followed = true)
    },
    onError(error) {
      console.log(error.message)
    }
  });

  return (
    <React.Fragment>
      <p>{user.blogName}</p>
      <form
        onSubmit={e => {
          e.preventDefault();
          followUser({
            variables: {
              user: user.blogName,
              currentUser: Cookies.get('blogName')
            }
          })
        }}
      >
        <button type='submit'>{followed ? 'Follow' : ''}</button>
      </form>
    </React.Fragment>
  )
}

export default UserResult;