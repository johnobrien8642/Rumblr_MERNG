import React from 'react';
import Cookies from 'js-cookie';
import PostShow from '../../posts/types/showOrUpdate/PostShow';
import { useQuery } from '@apollo/client';
import Queries from '../../../graphql/queries.js';
const { FETCH_POST_RADAR } = Queries;

const PostRadar = () => {

  let { loading, error, data } = useQuery(FETCH_POST_RADAR, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  const { fetchPostRadar } = data;
  if (fetchPostRadar) {
    return (
      <div>
        <h1>Radar</h1>
        <PostShow 
          post={fetchPostRadar}
          radar={true}
        />
      </div>
    )
  } else {
    return (
      <div>
        <h1>Radar</h1>
      </div>
    )
  }
}

export default PostRadar;