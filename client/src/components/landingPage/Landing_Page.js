import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import FeedIndex from '../feed/Index';
import Queries from '../../graphql/queries';
const { IS_LOGGED_IN } = Queries;

const LandingPage = () => {
  const { loading, error, data } = useQuery(IS_LOGGED_IN)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Loading...</p>
  
  if (data.isLoggedIn) {
    return <FeedIndex />
  } else {
    return (
      <div>
        <Link to='/login'><button>Login</button></Link>
        <Link to='/register'><button>Register</button></Link>
      </div>
    )
  }
}

export default LandingPage;