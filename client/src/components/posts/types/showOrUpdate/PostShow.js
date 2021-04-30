import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import PostNotes from '../../util/components/social/Post_Notes.js';
import PostOptions from '../../util/components/social/Post_Options.js';
import PostShowUtil from '../../util/functions/post_show_util.js';
import Queries from '../../../../graphql/queries';
const { postHeader, postBody, repostFooter, postTags } = PostShowUtil;
const { FETCH_LIKES_REPOSTS_AND_COMMENTS } = Queries;

const PostShow = ({ 
  post, tag, user, 
  repost, update, 
  setUpdate,
  toggleUpdate,
  feedType
}) => {
  let [active, setActive] = useState(false)
  
  let { loading, error, data } = useQuery(FETCH_LIKES_REPOSTS_AND_COMMENTS, {
    variables: {
      postId: post._id
    }
  })

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
            tag={tag}
            user={user}
            notesCount={data.fetchLikesRepostsAndComments.length}
            active={active}
            setActive={setActive}
            toggleNotes={toggleNotes}
            update={update}
            setUpdate={setUpdate}
            toggleUpdate={toggleUpdate}
            feedType={feedType}
          />
        </React.Fragment>
      )
    } 
  }

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`

  switch(post) {
    case null:
      return (
        <div>
          <p>Sorry, looks like this post no longer exists</p>
        </div>
      )
    default: 
      return (
        <React.Fragment>
          {postHeader(post)}
      
          {postBody(post)}
      
          {repostFooter(post)}
      
          {postTags(post)}

          {notesAndOptions()}
        </React.Fragment>
      )
  }
}

export default PostShow;