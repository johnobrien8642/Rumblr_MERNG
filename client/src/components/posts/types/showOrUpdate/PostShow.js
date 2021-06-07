import React, { useState, useRef } from 'react';
import { useQuery } from '@apollo/client';
import PostNotes from '../../util/components/social/Post_Notes.js';
import PostOptions from '../../util/components/social/Post_Options.js';
import RepostForm from '../../../posts/util/components/social/RepostForm';
import PostShowUtil from '../../util/functions/post_show_util.js';
import Queries from '../../../../graphql/queries';
import FeedUtil from '../../../posts/util/functions/feed_util.js';
const { postHeader, postBody, repostFooter, postTags } = PostShowUtil;
const { doesUserFollowUser } = FeedUtil;
const { FETCH_LIKES_REPOSTS_AND_COMMENTS } = Queries;

const PostShow = ({ 
  post, repost,
  update, setUpdate,
  toggleUpdate,
  discover, radar,
  currentUser
}) => {
  let [active, setActive] = useState(false)
  let [repostActive, setRepostActive] = useState(false)
  let doesUserFollowUserRef = useRef(false)

  doesUserFollowUser(doesUserFollowUserRef, currentUser, post.user)

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
            notesCount={data.fetchLikesRepostsAndComments.length}
            active={active}
            setActive={setActive}
            toggleNotes={toggleNotes}
            update={update}
            setUpdate={setUpdate}
            toggleUpdate={toggleUpdate}
            repostActive={repostActive}
            setRepostActive={setRepostActive}
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
          {postHeader(post, discover, radar, doesUserFollowUserRef)}
      
          {postBody(post)}
      
          {repostFooter(post)}
      
          {postTags(post)}

          {notesAndOptions()}

          <RepostForm 
            post={post}
            repostActive={repostActive}
            setRepostActive={setRepostActive}
          />
        </React.Fragment>
      )
  }
}

export default PostShow;