import React from 'react';
import PostShowUtil from '../../util/functions/post_show_util.js'
import PostOptions from '../../util/components/Post_Options'
const { postHeader, repostFooter, postTags } = PostShowUtil;

const PhotoPostShow = ({ post }) => {
  var postData = post.kind === 'Repost' ? post.post : post

  return(
    <React.Fragment>

      {postHeader(post)}

      <div>
        {postData.mainImages.map((mainImg, i) => {
          return <img key={i} src={`${mainImg.url}`} alt={'usefilename'} />
        })}
      </div>
      <p>{postData.description}</p>
      <div>
        {postData.descriptionImages.map((descripImg, i) => {
          return <img key={i} src={`${descripImg.url}`} alt={'usefilename'} />
        })}
      </div>
      
      {repostFooter(post)}

      {postTags(postData)}
    
      <PostOptions post={postData} />
    </React.Fragment>
  )
}

export default PhotoPostShow;