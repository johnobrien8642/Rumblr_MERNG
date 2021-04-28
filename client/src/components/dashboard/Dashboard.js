import React from 'react';
import { Route } from 'react-router-dom';
import PostNav from '../nav/Posts_Nav';
import Feed from '../feeds/Feed.js';
import RepostForm from '../posts/util/components/social/RepostForm';
import Cookies from 'js-cookie';

const Dashboard = props => {

  return(
    <div>
      <PostNav props={props} />
      <Route
        exact path={`${props.match.path}/repost/:blogName/:postId/:typename`}
        component={RepostForm}
      />
      <Feed currentUser={Cookies.get('currentUser')} />
    </div>
  )
}

export default Dashboard;