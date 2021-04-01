import React, { useEffect } from 'react'; 
import { useQuery } from '@apollo/client';
import Cookies from 'js-cookie';
import { Link, withRouter } from 'react-router-dom';
import LikeButton from '../util/Like_Button.js'
import Queries from '../../../graphql/queries';
const { DOES_USER_LIKE_POST } = Queries;

const PostOptions = ({ post }) => {
  let { loading, error, data, refetch } = useQuery(DOES_USER_LIKE_POST,{
    variables: {
      currentUser: Cookies.get('currentUser'),
      postId: post._id
    },
  })
  
  useEffect(() => {
    refetch()
  }, [refetch])

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`
  
  const { doesUserLikePost } = data;

  return (
    <div>
      <Link
        to={`/repost/${post.user.blogName}/${post._id}/${post.__typename}`}
      >
        Repost
      </Link>
      <LikeButton liked={doesUserLikePost} post={post} />
    </div>
  )
}

export default withRouter(PostOptions);