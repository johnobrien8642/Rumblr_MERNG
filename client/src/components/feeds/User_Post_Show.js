import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import PostUpdateOrShow from '../posts/types/showOrUpdate/PostUpdateOrShow'
import Queries from '../../graphql/queries.js';
const { FETCH_POST } = Queries;


const UserPostShow = () => {
  let { postId } = useParams();
  let { loading, error, data, } = useQuery(FETCH_POST, {
    variables: {
      query: postId
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  const { post } = data;

  return (
    <PostUpdateOrShow post={post} />
  )
}

export default UserPostShow;