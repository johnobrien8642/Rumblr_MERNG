import React from 'react';
import { useQuery } from '@apollo/client';
import Cookies from 'js-cookie';

import PostShow from '../../posts/types/showOrUpdate/PostShow';

import Queries from '../../../graphql/queries.js';
import PostShowUtil from '../../posts/util/functions/post_show_util.js';
const { FETCH_POST_RADAR } = Queries;
const { handlePostClassName } = PostShowUtil

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
      <div
        className='postRadar'
      >
        <h1 className='radarHeader'>Radar</h1>
        <div
          className={handlePostClassName(fetchPostRadar)}
        >
          <PostShow
            feedOrRadar={true}
            post={fetchPostRadar}
            radar={true}
          />
        </div>
      </div>
    )
  } else {
    return (
      <div
        className='postRadar'
      >
        <h1 className='radarHeader'>Radar</h1>
      </div>
    )
  }
}

export default PostRadar;