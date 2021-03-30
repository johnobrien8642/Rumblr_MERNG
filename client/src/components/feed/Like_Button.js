import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import Mutations from '../../graphql/mutations';
import Queries from '../../graphql/queries';
const { LIKE_POST, UNLIKE_POST } = Mutations;
const { FETCH_FEED } = Queries;

const LikeButton = ({ post, liked }) => {
  var initial = liked._id ? true : false

  let [status, setStatus] = useState(initial)

  let [likePost] = useMutation(LIKE_POST, {
    update(client, { data }) {
      client.writeQuery({
        query: FETCH_FEED,
        data: {
          post: {
            _id: data.likePost.post._id,
            likes: data.likePost.post.likes
          }
        },
        variables: {
          blogName: Cookies.get('currentUser')
        }
      })
    },
  })

  let [unlikePost] = useMutation(UNLIKE_POST, {
    update(client, { data }) {
      client.writeQuery({
        query: FETCH_FEED,
        data: {
          post: {
            _id: data.unlikePost._id,
            likes: data.unlikePost.likes
          }
        },
        variables: {
          blogName: Cookies.get('currentUser')
        }
      })
    }  
  })
  
  if (status) {
    return (
      <button
      type='button'
      onClick={() => {
        unlikePost({
          variables: {
            postId: post._id,
            user: Cookies.get('currentUser'),
            likeId: liked._id,
            type: post.__typename
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
            type: post.__typename
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