import React from 'react';
import Cookies from 'js-cookie';
import { useQuery, useMutation } from '@apollo/client';
import Queries from '../../graphql/queries';
import Mutations from '../../graphql/mutations';

const { SEARCH_USER_AND_POSTS } = Queries;
const { FOLLOW_USER } = Mutations;

const Results = ({ input }) => {

  let [followUser] = useMutation(FOLLOW_USER, {
    onCompleted(data) {
      console.log(data)
    },
    onError(error) {
      console.log(error.message)
    }
  });

  let { loading, error, data } = useQuery(SEARCH_USER_AND_POSTS,
      { variables: {
        filter: { OR: [
            {blogName_contains: input },
            {tags_contain: input }
          ]
        }
      }
    }
  );
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error.message}`;

  return (
    <div>
      <ul>
        {data.usersAndPosts.map((res, i) => {
          return (
          <li 
            key={i}
          >
            {res.blogName}
            <form
              onSubmit={e => {
                e.preventDefault();
                followUser({
                  variables: {
                    userId: res._id,
                    token: Cookies.get('auth-token')
                  }
                })
              }}
            >
              <button type='submit'>Follow</button>
            </form>
          </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Results;