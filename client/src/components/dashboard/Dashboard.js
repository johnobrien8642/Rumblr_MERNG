import React from 'react';
import { useQuery } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import PostNav from '../nav/Posts_Nav'
import Feed from '../feeds/Feed.js'


const Dashboard = () => {
  return(
    <div>
      <PostNav />
      <Feed />
    </div>
  )
}

export default withRouter(Dashboard);