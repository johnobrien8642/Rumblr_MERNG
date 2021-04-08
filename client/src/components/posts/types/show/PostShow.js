import React from 'react';
import PostOptions from '../../util/components/social/Post_Options.js'
import PostShowUtil from '../../util/functions/post_show_util.js';
const { postHeader, postBody, repostFooter, postTags } = PostShowUtil;

const PostShow = ({ post }) => {
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
      
          <PostOptions post={post} />
        </React.Fragment>
      )
  }
}

export default PostShow;