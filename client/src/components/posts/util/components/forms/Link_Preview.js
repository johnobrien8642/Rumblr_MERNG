import React, { useEffect, useState } from 'react';
import Validator from 'validator';
import LinkNameAndImage from '../forms/Link_Name_And_Image'
import LinkTitleAndDesc from '../forms/Link_Title_And_Desc'

const LinkPreview = ({ 
  link, setLink, result,
  siteName, setSiteName,
  imageUrl, setImageUrl, setTitle,
  title, linkDescription,
  setLinkDescription, resetLink
}) => {
  let [input, setInput] = useState('');
  let [showNameAndUrl, setShowNameAndUrl] = useState(imageUrl)
  let [showTitleAndLinkDescription, 
        setShowTitleAndLinkDescription] = useState(true)

  useEffect(() => {  
    if (!showNameAndUrl && !showTitleAndLinkDescription) {
      resetLink()
      resetInput()
    }
  })

  const resetInput = () => {
    setShowNameAndUrl(showNameAndUrl = true)
    setShowTitleAndLinkDescription(showTitleAndLinkDescription = true)
  }

  if (result) {
    return (
      <div>
        <LinkNameAndImage
          link={link}
          showNameAndUrl={showNameAndUrl}
          setShowNameAndUrl={setShowNameAndUrl}
          siteName={siteName}
          setSiteName={setSiteName}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
        />
  
        <LinkTitleAndDesc
          link={link}
          showTitleAndLinkDescription={showTitleAndLinkDescription}
          setShowTitleAndLinkDescription={setShowTitleAndLinkDescription}
          title={title}
          setTitle={setTitle}
          linkDescription={linkDescription}
          setLinkDescription={setLinkDescription}
        />
      </div>
    )
  } else {
    return(
      <div>
        <textarea
            value={input}
            placeholder='Type or paste a URL'
            onChange={e => {
                setInput(input = e.target.value)
                if (Validator.isURL(input)) {
                  setLink(link = input)
                }
              }
            }
        ></textarea>
      </div>
    )
  }
}

export default LinkPreview;