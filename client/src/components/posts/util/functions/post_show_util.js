import { Link } from 'react-router-dom';

const postHeader = (post) => {
  // console.log(post)
  if (post.kind === 'Repost') {
    return (
      <span>
        <Link to={`/view/blog/${post.user.blogName}`}>
          {post.user.blogName}
        </Link>
        <i className="fas fa-retweet"></i>
        <Link to={`/view/blog/${post.repostedFrom.blogName}`}>
          {post.repostedFrom.blogName}
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

const repostFooter = (post) => {
  if (post.kind === 'Repost') {
    return (
      <div>
        <span>
          <i className="fas fa-retweet"></i>
          <Link to={`/view/blog/${post.user.blogName}`}>
            {post.user.blogName}
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

const postTags = (postData) => (
  <div>
  {postData.tags.map((tag, i) => {
    var cleanedTitle = tag.title.slice(1)
    return (
      <div 
       key={i}
      >
        <Link 
          to={`/view/tag/${cleanedTitle}`}
        >
          {tag.title}
        </Link>
      </div>
    )
  })}
  </div>
)

const PostShowUtil = { postHeader, repostFooter, postTags }

export default PostShowUtil;