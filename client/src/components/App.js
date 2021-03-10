import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LandingPage from './landingPage/Landing_Page';
import Nav from '../components/nav/Nav'
// import AuthRoute from '../util/route_util';
import Login from '../components/login-logout/Login'
import Register from '../components/register/Register'

function App() {
  return (
    <div className="App">
      <Nav />
      <Switch>
        <Route exact path='/' component={LandingPage} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register}/>
      </Switch>
    </div>
  );
}

export default App;
