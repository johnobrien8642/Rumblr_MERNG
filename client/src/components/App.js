import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Nav from '../components/nav/Nav'
import Dashboard from './dashboard/Dashboard';
import Login from '../components/auth/login-logout/Login';
import Register from './auth/register/Register';
import WelcomePage from './auth/register/Welcome_Page';
import UserPostLikes from './feed/User_Post_Likes';
import UserFollowing from './feed/User_Following';
import UserBlog from './feed/User_Blog';
import Repost from './feed/Repost'
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
