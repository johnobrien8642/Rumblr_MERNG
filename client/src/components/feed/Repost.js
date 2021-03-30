import React from 'react';
import { useParams } from 'react-router-dom';
import PhotoPostRepost from '../posts/types/repost/PhotoPostRepost';

const Repost = () => {
  var { typename } = useParams();
  
  switch(typename) {
    case 'PhotoPostType':
      return <PhotoPostRepost />
    default:
      return <div></div>
  }
}

export default Repost;