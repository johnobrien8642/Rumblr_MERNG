import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Nav from '../components/nav/Nav'
import Dashboard from './dashboard/Dashboard';
import Login from '../components/auth/Login';
import Register from './auth/Register';
import WelcomePage from './auth/Welcome_Page';
import UserPostLikes from './feeds/User_Post_Likes_Feed';
import UserFollowing from './feeds/User_Following_Feed';
import UserBlog from './feeds/User_Blog_Show';
import Repost from './posts/util/Repost'
import AuthRoute from '../util/route_util';
import './../stylesheets/application.scss';

const App = () => {
  return (
    <div className="App">
      <Nav />
      <Switch>
        <AuthRoute exact path='/dashboard' component={Dashboard} />
        <Route exact path='/view/blog/:blogName' component={UserBlog} />
        <Route exact path='/repost/:blogName/:postId/:typename' component={Repost} />
        <Route exact path='/likes' component={UserPostLikes} />
        <Route exact path='/following' component={UserFollowing} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register}/>
        <Route exact path='/welcome' component={WelcomePage} />
        <Redirect from='/' to='/dashboard' />
      </Switch>
    </div>
  );
}

export default App;
