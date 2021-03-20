import React from 'react';
import Post from '../posts/Post'
// import { useQuery } from '@apollo/client'

const FeedIndex = () => {
  // const [getAllPosts] = useQuery(GET_ALL_POSTS)

  return(
    <div>
      <Post />
      <div 
        className={'mainFeed'}
      >
        
      </div>
    </div>
  )
}

export default FeedIndex;