import React from 'react';
import PostOptions from '../../../posts/util/components/Post_Options'
import PostShowUtil from '../../util/functions/post_show_util.js'
const { postHeader, repostFooter, postTags } = PostShowUtil;

const TextPostShow = ({ post }) => {
  
  var postData = post.kind === 'Repost' ? post.post : post
  return(
    <React.Fragment>

      {postHeader(post)}

      <h1>{postData.title}</h1>
      <p>{postData.body}</p>
      <div>
        {postData.descriptionImages.map((descripImg, i) => {
          return <img key={i} src={`${descripImg.url}`} alt={'usefilename'} />
        })}
      </div>
      
      {repostFooter(post)}

      {postTags(postData)}
    
      <PostOptions post={post} />
    </React.Fragment>
  )
}

export default TextPostShow;