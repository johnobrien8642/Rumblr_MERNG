import React from 'react';
import { Link } from 'react-router-dom';

const PhotoPostShow = ({ post }) => {

  const postHeader = () => {
    if (post.reposter) {
      return (
        <span>
          <Link to={`/view/blog/${post.reposter}`}>
            {post.reposter}
          </Link>
          <i class="fas fa-retweet"></i>
          <Link to={`/view/blog/${post.user.blogName}`}>
            {post.user.blogName}
          </Link>
        </span>
      )
    } else {
      return (
        <span>
          <Link 
            to={`/view/blog/${post.user.blogName}`}
          >
            {post.user.blogName}
          </Link>
        </span>
      )
    }
  }

  return(
    <React.Fragment>
      {postHeader()}
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