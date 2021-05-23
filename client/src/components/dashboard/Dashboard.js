import React from 'react';
import { Route } from 'react-router-dom';
import PostsNav from '../nav/Posts_Nav';
import Feed from '../feeds/Feed.js';
import PostRadar from '../dashboard/util/Post_Radar';
import CheckOutTheseBlogs from '../dashboard/util/Check_Out_These_Blogs';
import RepostForm from '../posts/util/components/social/RepostForm';

const Dashboard = props => {

  return(
    <div>
      <PostsNav props={props} />
      <Route
        exact path={`${props.match.path}/create`}
        render={(props) => (
          <PostsNav props={props} mobile={true} />
        )}
      />
      <PostRadar />
      <CheckOutTheseBlogs />
      <Route
        exact path={`${props.match.path}/repost/:blogName/:postId/:typename`}
        component={RepostForm}
      />
      <Feed user={null} />
    </div>
  )
}

export default Dashboard;