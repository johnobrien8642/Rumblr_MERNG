import React from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../../graphql/mutations';
import Queries from '../../../graphql/queries';
const { GET_USER_FEED } = Queries;
const { FOLLOW_TAG } = Mutations;

const TagResult = ({ tag }) => {
  let history = useHistory();

  let [followTag] = useMutation(FOLLOW_TAG, {
    update(client, { data }) {
      const { followTag } = data;
      console.log(followTag)
      var readQuery = client.readQuery({
        query: GET_USER_FEED,
        variables: {
          _id: followTag.user._id
        }
      })

      var { currentUser } = readQuery;
      var newPostArr = currentUser.posts.concat(followTag.posts)

      client.writeQuery({
        query: GET_USER_FEED,
        variables: {
          _id: followTag.user._id
        },
        data: {
          currentUser: {
            posts: newPostArr
          }
        }
      })
    },
    onCompleted(data) {
      history.push('/dashboard')
    },
    onError(error) {
      console.log(error.message)
    }
  });

  return (
    <React.Fragment>
      <p>{tag.title}</p>
      <form
        onSubmit={e => {
          e.preventDefault();
          followTag({
            variables: {
              tagId: tag._id
            }
          })
        }}
      >
        <button type='submit'>Follow</button>
      </form>
    </React.Fragment>
  )
}

export default TagResult;