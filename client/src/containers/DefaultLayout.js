import React, { Component } from 'react';
import {HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import routes from '../routes';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;


class DefaultLayout extends Component {
    render() {
        return (
            <React.Fragment>
            <HashRouter>
                  <React.Suspense fallback={loading()}>
                    <Switch>
                      {routes.map((route, idx) => {
                        return route.component ? (
                          <Route
                            key={idx}
                            path={route.path}
                            exact={route.exact}
                            name={route.name}
                            render={props => (
                              <route.component {...props} />
                            )} />
                        ) : (null);
                      })}
                      <Redirect from="/" to="/dashboard" />
                    </Switch>
                  </React.Suspense>
            </HashRouter>
    
          </React.Fragment>
    
        );
    }
}

export default DefaultLayout;