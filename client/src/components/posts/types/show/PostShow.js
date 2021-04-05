import React from 'react';
import PostOptions from '../../util/components/Post_Options.js'
import PostShowUtil from '../../util/functions/post_show_util.js';
const { postHeader, postBody, repostFooter, postTags } = PostShowUtil;

const PostShow = ({ post }) => {
  
  var postData = post.kind === 'Repost' ? post.post : post

  return (
    <React.Fragment>
      {postHeader(post)}

      {postBody(postData)}

      {repostFooter(post)}

      {postTags(postData)}

      <PostOptions post={post} />
    </React.Fragment>
  )
}

export default PostShow;