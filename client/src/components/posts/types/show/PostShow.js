import React from 'react';
import PostOptions from '../../util/components/Post_Options.js'
import PostShowUtil from '../../util/functions/post_show_util.js';
const { postHeader, postBody, repostFooter, postTags } = PostShowUtil;

const PostShow = ({ post }) => {
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

export default PostShow;