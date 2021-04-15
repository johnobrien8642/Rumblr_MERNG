import React from 'react'; 
import { useQuery, useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import { Link, withRouter } from 'react-router-dom';
import LikeButton from './Like_Button'
import Queries from '../../../../../graphql/queries';
import Mutations from '../../../../../graphql/mutations';
import PostCreateUtil from '../../functions/post_create_util.js'
const { DOES_USER_LIKE_POST, FETCH_USER_FEED } = Queries;
const { DELETE_POST } = Mutations;
const { updateCacheDelete } = PostCreateUtil;

const PostOptions = ({ 
  post, refetchNotes 
}) => {
  
  var postId
  if (post.kind === 'Like' && post.kind === 'Repost') {
    postId = post.post.post._id
  } else if (post.kind === 'Like') {
    postId = post.post._id
  } else {
    postId = post._id
  }

  let [deletePost] = useMutation(DELETE_POST, {
    update(client, { data }) {
      const { deletePost } = data;
      var currentUser = Cookies.get('currentUser')
      var query = FETCH_USER_FEED

      updateCacheDelete(
        client, deletePost,
        currentUser, query
      )
    }
  })

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
        to={`/dashboard/repost/${post.user.blogName}/${post._id}/${post.__typename}`}
      >
        Repost
      </Link>
      <LikeButton
        post={post}
        liked={doesUserLikePost}
        refetchNotes={refetchNotes}
        refetchDoesUserLikePost={refetch}
      />
      
      <img
        className='deletePostBtn'
        src="https://img.icons8.com/metro/26/000000/delete.png"
        alt=''
        onClick={() => {
          deletePost({
            variables: {
              postId: post._id
            }
          })
        }}
      />
    </div>
  )
}

export default withRouter(PostOptions);