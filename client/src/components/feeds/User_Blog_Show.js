import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import Feed from './Feed'
import Queries from '../../graphql/queries.js';
const { FETCH_USER } = Queries;


const UserBlogShow = () => {
  let { blogName } = useParams();
  let { loading, error, data, } = useQuery(FETCH_USER, {
    variables: {
      blogName: blogName
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  const { user } = data;
  return (
    <Feed
      blogName={blogName}
      user={user}
    />
  )
}

export default UserBlogShow;