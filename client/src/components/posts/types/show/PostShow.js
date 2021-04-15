import React from 'react';
import { useQuery } from '@apollo/client';
import PostNotes from '../../util/components/social/Post_Notes.js';
import PostOptions from '../../util/components/social/Post_Options.js';
import PostShowUtil from '../../util/functions/post_show_util.js';
import Queries from '../../../../graphql/queries';
const { postHeader, postBody, repostFooter, postTags } = PostShowUtil;
const { FETCH_LIKES_AND_REPOSTS } = Queries;

const PostShow = ({ post }) => {

  let { loading, error, data, refetch } = useQuery(FETCH_LIKES_AND_REPOSTS, {
    variables: {
      postId: post._id
    }
  })

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

          <PostNotes 
            notes={data.fetchLikesAndReposts}
          />
      
          <PostOptions 
            post={post}
            refetchNotes={refetch}
          />
        </React.Fragment>
      )
  }
}

export default PostShow;