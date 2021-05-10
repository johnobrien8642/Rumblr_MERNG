import React from 'react';
import { Route } from 'react-router-dom';
import PostNav from '../nav/Posts_Nav';
import Feed from '../feeds/Feed.js';
import PostRadar from '../dashboard/util/Post_Radar';
import RepostForm from '../posts/util/components/social/RepostForm';

const Dashboard = props => {

  return(
    <div>
      <PostNav props={props} />
      <PostRadar />
      <Route
        exact path={`${props.match.path}/repost/:blogName/:postId/:typename`}
        component={RepostForm}
      />
      <Feed user={null} />
    </div>
  )
}

export default Dashboard;