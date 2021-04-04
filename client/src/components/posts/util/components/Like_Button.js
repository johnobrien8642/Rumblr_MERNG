import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import Mutations from '../../../../graphql/mutations'
import Queries from '../../../../graphql/queries';
const { LIKE_POST, UNLIKE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const LikeButton = ({ post, liked, refetchDoesUserLikePost }) => {
  var initial = liked ? true : false

  let [status, setStatus] = useState(initial)

  useEffect(() => {
    refetchDoesUserLikePost()
  })

  let [likePost] = useMutation(LIKE_POST)

  let [unlikePost] = useMutation(UNLIKE_POST)
  
  if (status) {
    return (
      <button
      type='button'
      onClick={() => {
        unlikePost({
          variables: {
            likeId: liked._id
          }
        })
        setStatus(status = false)
      }}
      >
        UnLike
      </button>
    )
  } else {
    return (
      <button
      type='button'
      onClick={() => {
        likePost({
          variables: {
            postId: post._id,
            user: Cookies.get('currentUser'),
            postKind: post.kind
          }
        })
        setStatus(status = true)
      }}
      >
        Like
      </button>
    )
  }
}

export default LikeButton;