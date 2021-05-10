import React from 'react';
import { useQuery } from '@apollo/client';
import Cookies from 'js-cookie';
import UserResult from '../../search/resultTypes/User_Result';
import Queries from '../../../graphql/queries.js';
const { FETCH_CHECK_OUT_THESE_BLOGS } = Queries;

const CheckOutTheseBlogs = () => {

  let { loading, error, data } = useQuery(FETCH_CHECK_OUT_THESE_BLOGS, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  const { fetchCheckOutTheseBlogs } = data;
  
  return (
    <div>
      <h1>Check Out These Blogs</h1>
      {fetchCheckOutTheseBlogs.map(user => {
        return (
          <div>
            <UserResult user={user} />
          </div>
        )
      })}
    </div>
  )
}

export default CheckOutTheseBlogs;