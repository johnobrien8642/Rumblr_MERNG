import React from 'react'; 
import { useQuery } from '@apollo/client';
import Cookies from 'js-cookie';
import { Link, withRouter } from 'react-router-dom';
import LikeButton from './Like_Button'
import Queries from '../../../../../graphql/queries';
const { DOES_USER_LIKE_POST } = Queries;

const PostOptions = ({ 
  post, 
  refetchNotes, 
  notesCount,
  notesActive, 
  setNotesActive, 
  toggleNotes,
  update, 
  setUpdate, 
  toggleUpdate,
  repostActive,
  setRepostActive,
  confirmDelete,
  setConfirmDelete
}) => {
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

  if (post.user.blogName === Cookies.get('currentUser')) {
    return (
      <div
        className='postFooter'
      >
        <div
          className='notesBtn'
          onClick={() => {
            toggleNotes(notesActive, setNotesActive)
          }}
        >
          {notesCount} notes
        </div>
        
        <div
          className='postOptions'
        >
          <img
            className='commentBubbleBtn'
            src="https://img.icons8.com/windows/64/000000/speech-bubble--v1.png"
            alt=''
            onClick={() => {
              toggleNotes()
            }}
          />
          <img 
            className='repostIcon'
            src="https://img.icons8.com/material-outlined/64/000000/retweet.png"
            alt=''
            onClick={() => {
              setNotesActive(notesActive = false)
              setRepostActive(repostActive = true)
            }}
          />

          <LikeButton
            post={post}
            liked={doesUserLikePost}
            refetchDoesUserLikePost={refetch}
            refetchNotes={refetchNotes}
          />

          {/* {renderConfirmDelete()} */}

          <img
            className='deletePostBtn'
            src="https://img.icons8.com/metro/64/000000/delete.png"
            alt=''
            onClick={() => {
              setNotesActive(notesActive = false)
              setConfirmDelete(confirmDelete = true)
            }}
          />
          <img
            className='editPostBtn'
            src="https://img.icons8.com/windows/64/000000/edit--v1.png"
            alt=''
            onClick={() => {
              setNotesActive(notesActive = false)
              toggleUpdate(update, setUpdate)
            }}
          />
        </div>
      </div>
    )
  } else {
    return (
      <div
        className='postFooter'
      >
        <div
          className='notesBtn'
          onClick={() => {
            toggleNotes(notesActive, setNotesActive)
          }}
        >
          {notesCount} notes
        </div>
  
        <div
          className='postOptions'
        >
          <img
            className='addCommentBtn'
            src="https://img.icons8.com/windows/64/000000/speech-bubble--v1.png"
            alt=''
            onClick={() => {
              toggleNotes()
            }}
          />

          <Link
            to={`/dashboard/repost/${post.user.blogName}/${post._id}/${post.__typename}`}
          >
            <img 
              src="https://img.icons8.com/material-outlined/64/000000/retweet.png"
              alt=''
            />
          </Link>
          
          
          <LikeButton
            post={post}
            liked={doesUserLikePost}
            refetchDoesUserLikePost={refetch}
          />
        </div>
      </div>
    )
  }
}

export default withRouter(PostOptions);