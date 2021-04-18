import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Mutations from '../../../../../graphql/mutations';
import Queries from '../../../../../graphql/queries';
const { DELETE_COMMENT } = Mutations;
const { FETCH_LIKES_REPOSTS_AND_COMMENTS } = Queries

const DeleteComment = ({
  post, comment, 
}) => {
  let [active, setActive] = useState(false)

  let [deleteComment] = useMutation(DELETE_COMMENT, {
    update(client, { data }) {
      var query = FETCH_LIKES_REPOSTS_AND_COMMENTS
      
      var readFeed = client.readQuery({
        query: query,
        variables: {
          postId: post._id
        }
      })
      
      var { fetchLikesRepostsAndComments } = readFeed;
      
      var newPostArr = fetchLikesRepostsAndComments.filter(note => {
        if (note._id === comment._id) {
          return false
        } else {
          return true
        }
      })

      client.writeQuery({
        query: query,
        variables: {
          postId: post._id
        },
        data: {
          fetchLikesRepostsAndComments: newPostArr
        }
      })
    },
    onCompleted() {
      setActive(active = false)
    }
  })

  if (active) {
    return (
      <div>
        <div
          className='deleteCommentBtn'
          onClick={() => {
            deleteComment({
              variables: {
                commentId: comment._id
              }
            })
          }}
        >
          Delete Comment
        </div>
        <div
          className='closeCommentBtn'
          onClick={() => {
            setActive(active = false)
          }}
        >
          Close
        </div>
      </div>
    )
  } else {
    return (
      <React.Fragment>
        <img
          className='commentOptions'
          src="https://img.icons8.com/ios-glyphs/30/000000/more.png"
          alt=''
          onClick={() => {
            setActive(active = true)
          }}
        />
      </React.Fragment>
    )
  }
}

export default DeleteComment;