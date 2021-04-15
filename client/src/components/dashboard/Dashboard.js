import React from 'react';
import { Route } from 'react-router-dom';
import PostNav from '../nav/Posts_Nav';
import Feed from '../feeds/Feed.js';
import RepostForm from '../posts/util/components/social/RepostForm';

const Dashboard = props => {

  return(
    <div>
      <PostNav />
      <Route 
        exact path={`${props.match.path}/repost/:blogName/:postId/:typename`}
        component={RepostForm}
      />
      <Feed />
    </div>
  )
}

export default Dashboard;