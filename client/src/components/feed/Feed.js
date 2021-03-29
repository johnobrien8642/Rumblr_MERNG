import React, { useRef } from 'react';
import { useQuery } from '@apollo/client';
import Queries from '../../graphql/queries';
import PhotoPostShow from '../feed/types/PhotoPostShow';
import Cookies from 'js-cookie';
const { FETCH_USER_FEED } = Queries;

const Feed = ({ blogName }) => {
  let allPosts = useRef([]);
  
  let { loading, error, data } = useQuery(FETCH_USER_FEED, {
    variables: {
      blogName: blogName ? blogName : Cookies.get('currentUser')
    } 
  })
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;
  
  var { user } = data;
  console.log(user)
  allPosts.current = [...user.posts]

  user.reposts.forEach((repost, i) => {
    var post = repost.post
    post.createdAt = repost.createdAt
    post.reposter = user.blogName
    
    allPosts.current = [...allPosts.current, post]
  })

  user.userFollowing.forEach((user, i) => {
    allPosts.current = [...allPosts.current, ...user.posts]
  })

  user.tagFollows.forEach((tag, i) => {
    allPosts.current = [...allPosts.current, ...tag.posts]
  })

  allPosts.current.sort((a, b) => {  
    return parseInt(b.createdAt) - parseInt(a.createdAt)
  })

  return(
    <div>
        {allPosts.current.map((p, i) => {
          switch(p.__typename) {
            case 'PhotoPostType':
              return (
                <div
                  key={i}
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