import React from 'react';
import { Link } from 'react-router-dom';
import PostOptions from '../../util/Post_Options'

const PhotoPostShow = ({ post, reposter }) => {

  const postHeader = () => {
    if (reposter || post.reposter) {
      var reposterBlogName = reposter ? reposter : post.reposter
      return (
        <span>
          <Link to={`/view/blog/${reposterBlogName}`}>
            {reposterBlogName}
          </Link>
          <i className="fas fa-retweet"></i>
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

  const repostFooter = () => {
    if (post.reposter) {
      return (
        <div>
          <span>
            <i className="fas fa-retweet"></i>
            <Link to={`/view/blog/${post.reposter}`}>
              {post.reposter}
            </Link>
          </span>
          <p>{post.repostCaption}</p> 
        </div>
      )
    } else {
      <div>
      </div>
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
      
      {repostFooter()}
      
      <div>
        {post.tags.map((tag, i) => {
          return <div key={i}>{tag.title}</div>
        })}
      </div>
    
      <PostOptions post={post} />
    </React.Fragment>
  )
}

export default PhotoPostShow;