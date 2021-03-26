import React from 'react';
import { useQuery } from '@apollo/client';
import Queries from '../../graphql/queries';
import PhotoPostShow from '../feed/types/PhotoPostShow';
import Cookies from 'js-cookie';
const { FETCH_USER_FEED } = Queries;

const Feed = () => {
  let { loading, error, data } = useQuery(FETCH_USER_FEED, {
    variables: {
      token: Cookies.get('auth-token')
    }
  })
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  var { currentUser } = data;
  const allPosts = [...currentUser.posts]
  
  currentUser.userFollowing.forEach((user, i) => {
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
  console.log(allPosts) 
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
                  <PhotoPostShow post={p} />
                </div>
              )
            default:
              return (
                <div>
                </div>
              )
          }
        })}
    </div>
  )
}

export default Feed;