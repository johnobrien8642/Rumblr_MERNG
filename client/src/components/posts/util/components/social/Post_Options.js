import React, { useState } from 'react'; 
import { useQuery, useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import { Link, withRouter } from 'react-router-dom';
import LikeButton from './Like_Button'
import Queries from '../../../../../graphql/queries';
import Mutations from '../../../../../graphql/mutations';
import UpdateCacheUtil from '../../functions/update_cache_util.js';
const { DOES_USER_LIKE_POST, FETCH_USER_FEED } = Queries;
const { DELETE_POST } = Mutations;
const { postDelete } = UpdateCacheUtil;

const PostOptions = ({ 
  post, refetchNotes, notesCount,
  active, setActive, toggleNotes,
  update, setUpdate, toggleUpdate
}) => {
  let [askToConfirm, confirmDelete] = useState(false)
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

      postDelete(
        client, post, deletePost,
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

  const renderConfirmDelete = () => {
    if (askToConfirm) {
      return (
        <div
          >
            <p>Delete post?</p>
            <button
              onClick={() => {
                deletePost({
                  variables: {
                    post: post
                  }
                })
              }}
            >
              Delete post
            </button>
            
            <button
              onClick={() => {
                confirmDelete(askToConfirm = false)
              }}
            >
              Cancel
            </button>
          </div>
      )
    }
  }

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`

  const { doesUserLikePost } = data;

  if (post.user.blogName === Cookies.get('currentUser')) {
    return (
      <div>
        <div
          className='notesBtn'
          onClick={() => {
            toggleNotes(active, setActive)
          }}
        >
          {notesCount} Notes
        </div>
  
        <img
          className='commentBubbleBtn'
          src="https://img.icons8.com/windows/32/000000/speech-bubble--v1.png"
          alt=''
          onClick={() => {
            toggleNotes()
          }}
        />
  
        <Link
          to={`/dashboard/repost/${post.user.blogName}/${post._id}/${post.__typename}`}
        >
          <img 
            src="https://img.icons8.com/material-outlined/24/000000/retweet.png"
            alt=''
          />
        </Link>
  
  
        <LikeButton
          post={post}
          liked={doesUserLikePost}
          refetchDoesUserLikePost={refetch}
          refetchNotes={refetchNotes}
        />

        {renderConfirmDelete()}
        
        <img
          className='deletePostBtn'
          src="https://img.icons8.com/metro/26/000000/delete.png"
          alt=''
          onClick={() => {
            confirmDelete(askToConfirm = true)
          }}
        />
  
        <img
          className='editPostBtn'
          src="https://img.icons8.com/windows/32/000000/edit--v1.png"
          alt=''
          onClick={() => {
            toggleUpdate(update, setUpdate)
          }}
        />
      </div>
    )
  } else {
    return (
      <div>
        <div
          className='notesBtn'
          onClick={() => {
            toggleNotes(active, setActive)
          }}
        >
          {notesCount} Notes
        </div>
  
        <img
          className='addCommentBtn'
          src="https://img.icons8.com/windows/32/000000/speech-bubble--v1.png"
          alt=''
          onClick={() => {
            toggleNotes()
          }}
        />
  
        <Link
          to={`/dashboard/repost/${post.user.blogName}/${post._id}/${post.__typename}`}
        >
          <img 
            src="https://img.icons8.com/material-outlined/24/000000/retweet.png"
            alt=''
          />
        </Link>
  
  
        <LikeButton
          post={post}
          liked={doesUserLikePost}
          refetchDoesUserLikePost={refetch}
        />
      </div>
    )
  }
}

export default withRouter(PostOptions);