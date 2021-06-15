import React, { useState } from 'react';
import { useQuery } from '@apollo/client';

import PostNotes from '../../util/components/social/Post_Notes.js';
import PostOptions from '../../util/components/social/Post_Options.js';

import Queries from '../../../../graphql/queries';
import PostShowUtil from '../../util/functions/post_show_util.js';
const { postHeader, postBody, repostFooter, postTags } = PostShowUtil;
const { FETCH_LIKES_REPOSTS_AND_COMMENTS } = Queries;

const PostShow = ({ 
  post, 
  repost
}) => {
  
  let [active, setActive] = useState(false)
  let { loading, error, data } = useQuery(FETCH_LIKES_REPOSTS_AND_COMMENTS, {
    variables: {
      postId: post._id
    }
  })
  
  if (loading) return 'Loading...';
  if (error) return `FetchLikes etc Error: ${error}`

  const toggleNotes = () => {
    if (active) {
      setActive(active = false)
    } else {
      setActive(active = true)
    }
  }

  const notesAndOptions = () => {
    if (!repost) {
      return (
        <React.Fragment>
          <PostNotes
            post={post}
            notes={data.fetchLikesRepostsAndComments}
            active={active}
            setActive={setActive}
          />
      
          <PostOptions
            post={post}
            notesCount={data.fetchLikesRepostsAndComments.length}
            active={active}
            setActive={setActive}
            toggleNotes={toggleNotes}
          />
        </React.Fragment>
      )
    } 
  }
  
  switch(post) {
    case null:
      return (
        <div>
          <p>Sorry, looks like this post no longer exists</p>
        </div>
      )
    default: 
      return (
        <div
          tabIndex={-1}
          onBlur={e => {
            if (!e.relatedTarget) {
              setActive(active = false)
            }
          }}
        >
          {postHeader(post)}
      
          {postBody(post)}
      
          {repostFooter(post)}
      
          {postTags(post)}

          {notesAndOptions()}
        </div>
      )
  }
}

export default PostShow;