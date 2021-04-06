import React from 'react'; 
import { useQuery } from '@apollo/client';
import Cookies from 'js-cookie';
import { Link, withRouter } from 'react-router-dom';
import LikeButton from '../components/Like_Button.js'
import Queries from '../../../../graphql/queries';
const { DOES_USER_LIKE_POST } = Queries;

const PostOptions = ({ post }) => {
  
  var postId
  if (post.kind === 'Like' && post.kind === 'Repost') {
    postId = post.post.post._id
  } else if (post.kind === 'Like') {
    postId = post.post._id
  } else {
    postId = post._id
  }

  let { loading, error, data, refetch } = useQuery(DOES_USER_LIKE_POST,{
    variables: {
      user: Cookies.get('currentUser'),
      postId: postId
    }
  })

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
      <LikeButton 
        post={post}
        liked={doesUserLikePost} 
        refetchDoesUserLikePost={refetch}
      />
    </div>
  )
}

export default withRouter(PostOptions);