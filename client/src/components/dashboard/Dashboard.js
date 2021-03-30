import React from 'react';
import { withRouter } from 'react-router-dom';
import PostNav from '../posts/Post_Nav'
import Feed from '../feed/Feed.js'


const Dashboard = () => {

  return(
    <div>
      <PostNav />
      <Feed />
    </div>
  )
}

export default withRouter(Dashboard);