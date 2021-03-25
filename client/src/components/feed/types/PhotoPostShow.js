import React from 'react';

const PhotoPostShow = ({ post }) => {
  return(
    <React.Fragment>
      <span>{post.user.blogName}</span>
      <div>
        {post.mainImages.map((mainImg, i) => {
          return <img key={i} src={`${mainImg.url}`} alt={'usefilename'} />
        })}
      </div>
      <p>{post.description}</p>
      <div>
        {post.descriptionImages.map((descripImg, i) => {
          return <img key={i} src={`${descripImg.url}`} alt={'usefilename'} />
        })}
      </div>
      
      <div>
        {post.tags.map((tag, i) => {
          return <div key={i}>{tag.title}</div>
        })}
      </div>
    
    {/* <PostFeedOptions post={post}/> */}
    </React.Fragment>
  )
}

export default PhotoPostShow;