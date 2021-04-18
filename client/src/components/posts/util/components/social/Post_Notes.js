import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import DeleteComment from '../social/Delete_Comment'
import Mutations from '../../../../../graphql/mutations';
import Queries from '../../../../../graphql/queries';
const { COMMENT_POST } = Mutations;
const { FETCH_LIKES_REPOSTS_AND_COMMENTS } = Queries;

const PostNotes = ({
  post, notes, setActive, active
}) => {
  var [content, setContent] = useState('')
  let [comment] = useMutation(COMMENT_POST, {
    update(client, { data }) {
      let { comment } = data;
      let query = FETCH_LIKES_REPOSTS_AND_COMMENTS;
      // var currentUser = Cookies.get('currentUser')
      
      var readFeed = client.readQuery({
        query: query,
        variables: {
          postId: post._id
        }
      })
      
      var { fetchLikesRepostsAndComments } = readFeed;

      var newPostArr = [...fetchLikesRepostsAndComments, comment]
      
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
      setContent(content = '')
    }
  })

  const resolveKind = (note) => {
    if (note.kind === 'Repost') {
      return 'Repost'
    } else if (note.kind === 'Comment') {
      return 'Comment'
    } else if (note.kind === 'Like') {
      return 'Like'
    }
  }


  const handleSubmit = () => {
    let commentData = {}
    commentData.user = Cookies.get('currentUser')
    commentData.postId = post._id
    commentData.content = content
    commentData.kind = post.kind

    comment({
      variables: {
        commentData: commentData
      }
    })
  }

  if (active) {
    return (
      <div
        tabIndex={-1}
      >
        <img
          className='backBtn'
          src="https://img.icons8.com/windows/32/000000/long-arrow-left.png"
          alt=''
          onClick={() => {
            setActive(active = false)
          }}
          />
        <ul
        >
          {notes.map((n, i) => {
            var note = resolveKind(n)
            if (note === 'Comment') {
              return (
                <li
                  key={n._id}
                >
                  <Link
                    to={`/view/blog/${n.user.blogName}`}
                  >
                    {n.user.blogName}
                  </Link>
                  <img 
                    src="https://img.icons8.com/windows/32/000000/speech-bubble--v1.png"
                    alt=''
                  />
                  <DeleteComment 
                    post={post}
                    comment={n}
                  />
                  <p>{n.content}</p>
                </li>
              )
            } else if (note === 'Repost') {
              return (
                <li
                  key={n._id}
                >
                  <Link
                    to={`/view/blog/${n.user.blogName}`}
                  >
                    {n.user.blogName}
                  </Link>
                  <img 
                    src="https://img.icons8.com/material-outlined/24/000000/retweet.png"
                    alt=''
                  />
                  <Link
                    to={`/view/blog/${n.repostedFrom.blogName}`}
                  >
                    {n.repostedFrom.blogName}
                  </Link>
                  <p>{n.repostCaption}</p>
                </li>
              )
            } else if (note === 'Like') {
              return (
                <li
                  key={n._id}
                >
                  <Link
                    to={`/view/blog/${n.user.blogName}`}
                  >
                    {n.user.blogName}
                  </Link>
                  <img 
                    src="https://img.icons8.com/material-rounded/24/000000/like--v1.png"
                    alt=''
                  />
                </li>
              )
            } else {
              return (
                <div>
                </div>
              )
            }
          })}
        </ul>
         
        <textarea
          value={content}
          placeholder={'Speak your mind...'}
          onChange={e => {
            setContent(content = e.target.value)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSubmit()
            }
          }}
        ></textarea>

        <button
          type='button'
          disabled={!content}
          onClick={() => {
            handleSubmit() 
          }}
        >
          Reply
        </button>
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }


}

export default PostNotes;