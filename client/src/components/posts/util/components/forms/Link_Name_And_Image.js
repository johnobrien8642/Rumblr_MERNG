import React from 'react';
import PostCreateUtil from '../../functions/post_create_util.js'
const { removeLinkSiteNameAndImage } = PostCreateUtil;

const LinkNameAndImage = ({
  link, showNameAndUrl, 
  setShowNameAndUrl,
  siteName, setSiteName,
  imageUrl, setImageUrl
}) => {
  
  if (showNameAndUrl) {
    return (
      <div>
        <button
          type='button'
          onClick={() => removeLinkSiteNameAndImage(
            siteName, setSiteName, 
            imageUrl, setImageUrl,
            showNameAndUrl, setShowNameAndUrl,
          )}
        >
          X
        </button>
        <a href={link}>
          <span>{siteName}</span>
          <img src={imageUrl}  alt={'link page img'}/>
        </a>
      </div>
    )
  } else {
    return (
      <div></div>
    )
  }
}

export default LinkNameAndImage;