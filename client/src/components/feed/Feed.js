import React from 'react';
import { useQuery } from '@apollo/client';
import Queries from '../../graphql/queries';
import PhotoPostShow from '../feed/types/PhotoPostShow';
const { GET_USER_FEED } = Queries;

const Feed = () => {
  let { loading, error, data } = useQuery(GET_USER_FEED)

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  var { currentUser } = data;
  const allPosts = [...currentUser.posts]
  
  currentUser.userFollows.forEach((user, i) => {
    user.populate('posts').then(user => {
      allPosts.concat(user.posts)
    })
  })
  currentUser.tagFollows.forEach((tag, i) => {
    tag.populate('posts').then(tag => {
      allPosts.concat(tag.posts)
    })
  })

  allPosts.sort((a, b) => b.createdAt - a.createdAt)
  
  return(
    <div>
        {allPosts.map((p, i) => {
          switch(p.__typename) {
            case 'PhotoPostType':
              return (
                <div
                  key={p._id}
                  className='post'
                >
                  <PhotoPostShow post={p} idx={i} />
                </div>
              )
          }
        })}
    </div>
  )
}

export default Feed;