import React from 'react';
import { useMutation } from '@apollo/client';
import { useHistory, Link } from 'react-router-dom';
import Mutations from '../../../graphql/mutations';
import Queries from '../../../graphql/queries';
import Cookies from 'js-cookie';
const { FETCH_USER_FEED } = Queries;
const { FOLLOW_TAG } = Mutations;

const TagResult = ({ tag, activate }) => {
  let history = useHistory();

  let [followTag] = useMutation(FOLLOW_TAG, {
    update(client, { data }) {
      console.log(data)
      const { followTag } = data;

      var readQuery = client.readQuery({
        query: FETCH_USER_FEED,
        variables: {
          _id: followTag.user._id
        }
      })

      var { currentUser } = readQuery;
      var newPostArr = currentUser.tagFollows.push(followTag._id)

      client.writeQuery({
        query: FETCH_USER_FEED,
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
      <Link 
        to={`/view/tag/${tag.title}`}
        onClick={activate}
      >
        {tag.title}
      </Link>
      <form
        onSubmit={e => {
          e.preventDefault();
          followTag({
            variables: {
              tagId: tag._id,
              blogName: Cookies.get('blogName')
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