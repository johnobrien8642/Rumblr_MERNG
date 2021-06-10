import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import DeleteComment from '../social/Delete_Comment'
import ProfilePic from '../../../../user/util/components/Profile_Pic';
import Mutations from '../../../../../graphql/mutations';
import Queries from '../../../../../graphql/queries';
const { COMMENT_POST } = Mutations;
const { FETCH_LIKES_REPOSTS_AND_COMMENTS } = Queries;

const PostNotes = ({
  post,
  notesCount,
  notes, 
  notesActive,
  setNotesActive, 
}) => {
  var [content, setContent] = useState('')

  useEffect(() => {
    var el = document.querySelector('.notes')

    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })

  let [comment] = useMutation(COMMENT_POST, {
    update(client, { data }) {
      let { comment } = data;
      let query = FETCH_LIKES_REPOSTS_AND_COMMENTS;
      
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
    commentData.postAuthorId = post.user._id
    commentData.postId = post._id
    commentData.content = content
    commentData.kind = post.kind

    comment({
      variables: {
        commentData: commentData
      }
    })
  }
  
  if (notesActive) {
    return (
      <div
        className='postNotes'
        tabIndex={-1}
      >
        <div
          className='notesHeader'
        >
          <img
            className='backBtn'
            src="https://img.icons8.com/windows/64/000000/long-arrow-left.png"
            alt=''
            onClick={() => {
              setNotesActive(notesActive = false)
            }}
          />
          <span>{notesCount} notes</span>
        </div>

        <ul
          className='notes'
        >
          {notes.map((n, i) => {
            var note = resolveKind(n)
            if (note === 'Comment') {
              return (
                <li
                  key={n._id}
                >
                  <div
                    className='noteProfilePicContainer'
                  >
                    <ProfilePic
                      user={n.user}
                      activity={n}
                    />
                  </div>

                  <div
                    className='noteContentContainer'
                  >
                    <div
                      className='noteContentHeader'
                    >
                      <Link
                        to={`/view/blog/${n.user.blogName}`}
                      >
                        {n.user.blogName}
                      </Link>

                      <div>
                        <DeleteComment
                          post={post}
                          comment={n}
                        />
                      </div>
                    </div>
                    <p>{n.content}</p>
                  </div>
                </li>
              )
            } else if (note === 'Repost') {

              var caption
              n.repostTrail.forEach(captionObj => {
                if (captionObj.user._id === n.user._id) {
                  caption = captionObj.caption
                }
              })

              return (
                <li
                  key={n._id}
                >
                  <div
                    className='noteProfileContainer'
                  >
                    <ProfilePic 
                      user={n.user}
                      activity={n}
                    />
                  </div>

                  <div
                    className='noteContentContainer'
                  >
                    <div
                      className='noteContentHeader repost'
                    >
                      <Link
                        className='user'
                        to={`/view/blog/${n.user.blogName}`}
                      >
                        {n.user.blogName}
                      </Link>

                      <div
                        className='repostIconAndRepostFromContainer'
                      >
                        <img
                          className='repostIconHeader'
                          src="https://img.icons8.com/material-outlined/64/000000/retweet.png"
                          alt=''
                        />

                        <Link
                          className='repostedFrom'
                          to={`/view/blog/${n.repostedFrom.blogName}`}
                        >
                          {n.repostedFrom.blogName}
                        </Link>
                      </div>
                    </div>
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(caption)
                      }}
                    />
                    {/* <p>{note.repostCaptions.filter(obj => obj.userId === n.user._id)}</p> */}
                  </div>
                </li>
              )
            } else if (note === 'Like') {
              return (
                <li
                  key={n._id}
                >

                  <div
                    className='noteProfilePicContainer'
                  >
                    <ProfilePic
                      user={n.user}
                      activity={n}
                    />
                  </div>

                  <div
                    className='noteContentContainer'
                  >
                    <div
                      className='noteContentHeader'
                    >
                      <Link
                        to={`/view/blog/${n.user.blogName}`}
                      >
                        {n.user.blogName}
                      </Link>
                    </div>

                    <p>likes this</p>
                  </div>
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

        <div
          className='commentInputContainer'
        > 
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