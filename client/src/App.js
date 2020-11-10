import React, { Component } from 'react';
import './App.css';
import { HashRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container } from 'react-bootstrap';
import { NavigationBar } from './components/NavigationBar'
import Sidebar from './components/Sidebar'

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
const Userlogin = React.lazy(() => import('./components/Userlogin'));
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <HashRouter>
          <React.Suspense fallback={loading()}>
            <NavigationBar />
            <Sidebar />
            <Container>
              <Switch>
                <Route exact path="/login" name="Login Page" component={Userlogin} />
                <Route path="/" name="Home" render={props => <DefaultLayout {...props} />} />
              </Switch>
            </Container>
          </React.Suspense>
        </HashRouter>
      </React.Fragment>
    );
  }
}

export default App;
