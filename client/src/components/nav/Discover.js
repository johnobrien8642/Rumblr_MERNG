import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import RecommendedTags from '../nav/Recommended_Tags';
import AllTagFeed from '../feeds/All_Tag_Feed';
import Queries from '../../graphql/queries.js';
import Cookies from 'js-cookie';
import FollowedTags from '../search/resultTypes/Followed_Tags_Result';
const { FETCH_RECOMMENDED_TAGS } = Queries;

const Discover = () => {
  let [tag, setTag] = useState(null)
 
  let { loading, error, data } = useQuery(FETCH_RECOMMENDED_TAGS, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  const { fetchRecommendedTags } = data;
  
  return (
    <div>
    <div>
      <RecommendedTags
        recTags={fetchRecommendedTags}
        tag={tag}
        setTag={setTag}
      />
      <FollowedTags 
        followedActive={true} 
        discover={true} 
      />
    </div>
      <AllTagFeed />
    </div>
  )
}

export default Discover;