import React from 'react';
import { useMutation } from '@apollo/client';
import Mutations from '../../../graphql/mutations';
const { FOLLOW_USER } = Mutations;

const UserResult = ({ user }) => {

  let [followUser] = useMutation(FOLLOW_USER, {
    onCompleted(data) {
      console.log(data)
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
              userId: user._id
            }
          })
        }}
      >
        <button type='submit'>Follow</button>
      </form>
    </React.Fragment>
  )
}

export default UserResult;