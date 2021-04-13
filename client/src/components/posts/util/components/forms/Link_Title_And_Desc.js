import React from 'react';
import PostCreateUtil from '../../functions/post_create_util.js'
const { removeLinkTitleAndDesc } = PostCreateUtil;

const LinkTitleAndDesc = ({
  link, showTitleAndLinkDescription, 
  setShowTitleAndLinkDescription, 
  setTitle, title, setLinkDescription, 
  linkDescription,
}) => {

  if (showTitleAndLinkDescription) {
    return (
      <div>
        <button
          type='button'
          onClick={() => removeLinkTitleAndDesc(
            title, setTitle,
            setLinkDescription,
            linkDescription,
            showTitleAndLinkDescription,
            setShowTitleAndLinkDescription,
          )
        }
        >
          X
        </button>
        <a href={link}>
          <h2>{title}</h2>
          <p>{linkDescription}</p>
        </a>
      </div>
    )
  } else {
    return (
      <div></div>
    )
  }
}

export default LinkTitleAndDesc;