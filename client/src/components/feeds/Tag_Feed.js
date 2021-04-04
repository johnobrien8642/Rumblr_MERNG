import React from 'react';
import Feed from '../feeds/Feed.js';
import { useParams } from 'react-router-dom';
 
const TagFeed = () => {
  let { tagTitle } = useParams();
  
  return (
    <Feed tagTitle={tagTitle} />
  )
}

export default TagFeed;