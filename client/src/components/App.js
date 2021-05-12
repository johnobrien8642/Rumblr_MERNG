import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Nav from '../components/nav/Nav'
import Dashboard from './dashboard/Dashboard';
import Login from '../components/auth/Login';
import Register from './auth/Register';
import WelcomePage from './auth/Welcome_Page';
import TagFeed from './feeds/Tag_Feed';
import UserPostLikesFeed from './feeds/User_Post_Likes_Feed';
import UserFollowingFeed from './feeds/User_Following_Feed';
import UserBlogShow from './feeds/User_Blog_Show';
import UserPostShow from './feeds/User_Post_Show';
import UserFollowersFeed from './feeds/User_Followers_Feed';
import UserSettings from './user/User_Settings';
import Discover from './nav/Discover';
import AuthRoute from '../util/route_util';
import 'react-h5-audio-player/lib/styles.css';
import './../stylesheets/application.scss';


const App = () => {
  return (
    <div className="App">
      <Nav />
      <Switch>
        <AuthRoute path={'/dashboard'} component={Dashboard} />
        <AuthRoute path={'/view/tag/:tagTitle'} component={TagFeed} />
        <AuthRoute path={'/view/blog/:blogName'} component={UserBlogShow} />
        <AuthRoute exact path={'/settings/account'} component={UserSettings} />
        <AuthRoute exact path='/blog/view/:blogName/:postId' component={UserPostShow} />
        <AuthRoute exact path='/blog/:blogName/followers' component={UserFollowersFeed} />
        <AuthRoute exact path='/discover' component={Discover} />
        <AuthRoute exact path='/likes' component={UserPostLikesFeed} />
        <AuthRoute exact path='/following' component={UserFollowingFeed} />
        {/* uncomment below for email auth welcome page */}
        {/* <AuthRoute exact path='/welcome' component={WelcomePage} /> */}
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register}/>
        <Redirect from='/' to='/dashboard' />
      </Switch>
    </div>
  );
}

export default App;
