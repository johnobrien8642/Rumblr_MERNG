import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Nav from '../components/nav/Nav'
import LandingPage from './landingPage/Landing_Page';
import Login from '../components/auth/login-logout/Login'
import Register from './auth/register/Register'
import WelcomePage from './auth/register/Welcome_Page'

// import AuthRoute from '../util/route_util';

function App() {
  return (
    <div className="App">
      <Nav />
      <Switch>
        <Route exact path='/' component={LandingPage} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register}/>
        <Route exact path='/welcome' component={WelcomePage} />
      </Switch>
    </div>
  );
}

export default App;
