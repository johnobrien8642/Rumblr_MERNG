import React from 'react';
import { useParams } from 'react-router-dom';
import Feed from '../feed/Feed'


const UserBlog = () => {
  let { blogName } = useParams();

  return (
    <Feed blogName={blogName} />
  )
}

export default UserBlog;